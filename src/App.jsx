import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, LayoutDashboard, Users, UsersRound,
  Settings, ChevronDown, BarChart3, UserPlus,
  Clock, CheckCircle2, AlertCircle, Bell, ArrowLeft, MessageSquare, Mail, GitBranch, Calendar
} from 'lucide-react';
import ManagerView from './components/ManagerView';
import EmployeeView from './components/EmployeeView';
import TeamsView from './components/TeamsView';
import HomeView from './components/HomeView';
import NotificationsPopover from './components/NotificationsPopover';
import ChatView from './components/ChatView';
import EmailView from './components/EmailView';
import LoginView from './components/LoginView';
import GitView from './components/GitView';
import SettingsView from './components/SettingsView';
import CalendarView from './components/CalendarView';
import KnowledgeOSBot from './components/KnowledgeOSBot';
import { SEED_EMPLOYEES, JIRA_TASKS } from './data';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { LanguageProvider, useLanguage } from './LanguageProvider';
import './index.css';

const MANAGER_NAV_ITEMS = [
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'teams',     label: 'Team',      icon: UsersRound },
  { id: 'email',     label: 'Email',     icon: Mail },
  { id: 'chat',      label: 'Chat',      icon: MessageSquare },
  { id: 'git',       label: 'Git',       icon: GitBranch },
  { id: 'calendar',  label: 'Calendar',  icon: Calendar },
  { id: 'settings',  label: 'Settings',  icon: Settings },
];

const EMPLOYEE_NAV_ITEMS = [
  { id: 'onboarding',    label: 'My Dashboard', icon: UserPlus },
  { id: 'organization',  label: 'Team',          icon: UsersRound },
  { id: 'email',         label: 'Email',         icon: Mail },
  { id: 'chat',          label: 'Chat',          icon: MessageSquare },
  { id: 'git',           label: 'Git',           icon: GitBranch },
  { id: 'calendar',      label: 'Calendar',      icon: Calendar },
  { id: 'settings',      label: 'Settings',      icon: Settings },
];

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppInner />
      </LanguageProvider>
    </ThemeProvider>
  );
}

function AppInner() {
  const { t } = useLanguage();
  const [activeNav, setActiveNav]     = useState('home');
  
  const [meetings, setMeetings] = useState(() => {
    const saved = localStorage.getItem('provision_bot_meetings');
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    localStorage.setItem('provision_bot_meetings', JSON.stringify(meetings));
  }, [meetings]);

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('provision_employees');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Patch stale cached tasks: merge storyPoints from seed if missing
      const updatedEmployees = parsed.map(emp => {
        if (!emp.tasks) return emp;
        const seedTasks = JIRA_TASKS[emp.department] || [];
        const patched = emp.tasks.map(t => {
          if (t.storyPoints != null) return t; // already has points
          const seed = seedTasks.find(s => s.id === t.id);
          return seed ? { ...t, storyPoints: seed.storyPoints } : t;
        });
        return { ...emp, tasks: patched };
      });
      
      // Merge in any new seed employees that aren't in local storage yet
      const existingIds = new Set(updatedEmployees.map(e => e.id));
      const newSeeds = SEED_EMPLOYEES.filter(e => !existingIds.has(e.id));
      
      return [...updatedEmployees, ...newSeeds];
    }
    return SEED_EMPLOYEES;
  });

  // Persist to localStorage whenever employees change
  React.useEffect(() => {
    localStorage.setItem('provision_employees', JSON.stringify(employees));
  }, [employees]);
  
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Used by manager when viewing an employee
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setActiveNav(user.type === 'manager' ? 'employees' : 'onboarding');
  };

  const handleViewEmployee = (emp) => {
    setSelectedEmployee(emp);
  };

  const handleBack = () => {
    setSelectedEmployee(null);
  };

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  const isManager = currentUser.type === 'manager';
  const NAV_ITEMS = isManager ? MANAGER_NAV_ITEMS : EMPLOYEE_NAV_ITEMS;

  // Determine what to show in the header
  const isPeekingEmployee = isManager && selectedEmployee;
  
  let headerTitle = NAV_ITEMS.find(n => n.id === activeNav)?.label;
  let headerSubtitle = 'Provision · Internal Platform';
  
  if (isPeekingEmployee) {
    headerTitle = selectedEmployee.name;
    headerSubtitle = `${selectedEmployee.role} · ${selectedEmployee.department}`;
  } else if (!isManager && activeNav === 'onboarding') {
    headerTitle = currentUser.name;
    headerSubtitle = `${currentUser.role} · ${currentUser.department}`;
  }

  // Get avatar initials
  const initials = isManager ? 'MG' : (currentUser.name[0] + (currentUser.name.split(' ')[1]?.[0] || ''));

  return (
    <div id="app-shell" className="flex h-screen bg-surface-950 overflow-hidden">

      {/* ── Left Sidebar (Teams-style) ── */}
      <aside id="app-sidebar" className="flex flex-col w-16 md:w-56 bg-surface-900 border-r border-surface-600 shrink-0 z-20">

        {/* Logo */}
        <div className="h-14 flex items-center px-3 md:px-4 border-b border-surface-600 gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center shrink-0">
            <Shield size={16} className="text-white" />
          </div>
          <span className="font-extrabold text-white tracking-tight text-sm hidden md:block">Provision</span>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 p-2 flex-1 mt-2">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeNav === item.id && !isPeekingEmployee;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveNav(item.id); setSelectedEmployee(null); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium w-full text-left group relative ${
                  isActive
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-slate-500 hover:bg-surface-700 hover:text-white'
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span className="hidden md:block">{t(item.label)}</span>
                {/* Tooltip on mobile */}
                <span className="absolute left-14 bg-surface-700 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap md:hidden z-50 border border-surface-500">
                  {t(item.label)}
                </span>
              </button>
            );
          })}
        </nav>

        {/* User Profile (bottom of sidebar) */}
        <div className="p-4 border-t border-surface-600 flex items-center gap-3">
          {currentUser.avatar ? (
            <img src={currentUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-surface-500 object-cover shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
          )}
          <div className="hidden md:block overflow-hidden">
            <p className="text-white text-xs font-semibold truncate">{currentUser.name}</p>
            <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold truncate">{currentUser.type}</p>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Top bar */}
        <header id="app-header" className="h-14 bg-surface-900 border-b border-surface-600 flex items-center justify-between px-6 shrink-0 relative">
          <div className="flex items-center gap-3">
            {isPeekingEmployee && (
              <button onClick={handleBack} className="p-1 px-2 -ml-2 rounded hover:bg-surface-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium">
                <ArrowLeft size={14} /> Back
              </button>
            )}
            <div>
              <h1 className="text-white font-semibold text-sm">
                {t(headerTitle || '')}
              </h1>
              <p className="text-slate-500 text-xs">
                {t(headerSubtitle || '')}
              </p>
            </div>
          </div>
          
          <div className="relative flex items-center gap-3">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative btn-ghost p-2 hover:bg-surface-800 rounded transition-colors text-slate-400 hover:text-white">
              <Bell size={16} />
              <span className="absolute top-1 right-2 w-2 h-2 bg-primary-500 rounded-full" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <NotificationsPopover 
                  mode={currentUser.type} 
                  employee={isPeekingEmployee ? selectedEmployee : (currentUser.type === 'employee' ? currentUser : null)} 
                  employees={employees} 
                  onClose={() => setShowNotifications(false)} 
                />
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Page content (scrollable) */}
        <main id="app-main" className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            
            {/* MANAGER PATHS */}
            {isManager && isPeekingEmployee && (
              <motion.div key="emp-view" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <EmployeeView employee={selectedEmployee} employees={employees} setEmployees={setEmployees} onBack={handleBack} />
              </motion.div>
            )}
            {isManager && !isPeekingEmployee && activeNav === 'teams' && (
              <motion.div key="teams" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <TeamsView employees={employees} onViewEmployee={handleViewEmployee} readOnly={false} />
              </motion.div>
            )}
            {isManager && !isPeekingEmployee && activeNav === 'employees' && (
              <motion.div key="employees" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ManagerView employees={employees} setEmployees={setEmployees} onViewEmployee={handleViewEmployee} />
              </motion.div>
            )}

            {/* EMPLOYEE PATHS */}
            {!isManager && activeNav === 'onboarding' && (
              <motion.div key="my-onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Reusing EmployeeView but without manager controls and no back button */}
                <div className="pointer-events-none absolute opacity-0"></div> {/* filler for animation */}
                <EmployeeView 
                  employee={currentUser} 
                  employees={employees} 
                  setEmployees={setEmployees} 
                  onBack={() => {}} 
                  readOnly={true} // can pass readOnly flag if needed, but employee view naturally doesn't let them edit their own permissions
                />
              </motion.div>
            )}
            {!isManager && activeNav === 'organization' && (
              <motion.div key="organization" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <TeamsView employees={employees} onViewEmployee={() => {}} readOnly={true} />
              </motion.div>
            )}

            {/* SHARED */}
            {!isPeekingEmployee && activeNav === 'chat' && (
              <motion.div key="chat" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ChatView currentUser={currentUser} employees={employees} />
              </motion.div>
            )}

            {!isPeekingEmployee && activeNav === 'email' && (
              <motion.div key="email" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <EmailView currentUser={currentUser} />
              </motion.div>
            )}

            {!isPeekingEmployee && activeNav === 'git' && (
              <motion.div key="git" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GitView currentUser={currentUser} />
              </motion.div>
            )}

            {!isPeekingEmployee && activeNav === 'calendar' && (
              <motion.div key="calendar" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CalendarView currentUser={currentUser} employees={employees} meetings={meetings} />
              </motion.div>
            )}

            {!isPeekingEmployee && activeNav === 'settings' && (
              <motion.div key="settings" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SettingsView currentUser={currentUser} setEmployees={setEmployees} setCurrentUser={setCurrentUser} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Floating KnowledgeOS Assistant */}
      <KnowledgeOSBot currentUser={currentUser} employees={employees} setEmployees={setEmployees} setMeetings={setMeetings} />

      {/* Dark/Light Mode Toggle — shifted left to avoid overlap */}
      <ThemeToggle position="left" />
    </div>
  );
}

function ThemeToggle({ position = 'right' }) {
  const { isDark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`fixed bottom-6 ${position === 'left' ? 'right-[96px]' : 'right-6'} z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95`}
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #1c2333, #30363d)'
          : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
        border: isDark ? '1.5px solid #30363d' : '1.5px solid #f59e0b',
        boxShadow: isDark
          ? '0 4px 24px rgba(99,102,241,0.25)'
          : '0 4px 24px rgba(251,191,36,0.4)',
      }}
    >
      {isDark ? (
        // Sun icon
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        // Moon icon
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
