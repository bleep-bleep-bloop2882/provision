import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, LayoutDashboard, Users, UsersRound,
  Settings, ChevronDown, BarChart3, UserPlus,
  Clock, CheckCircle2, AlertCircle, Bell, ArrowLeft, MessageSquare, Mail
} from 'lucide-react';
import ManagerView from './components/ManagerView';
import EmployeeView from './components/EmployeeView';
import TeamsView from './components/TeamsView';
import HomeView from './components/HomeView';
import NotificationsPopover from './components/NotificationsPopover';
import ChatView from './components/ChatView';
import EmailView from './components/EmailView';
import LoginView from './components/LoginView';
import { SEED_EMPLOYEES, JIRA_TASKS } from './data';
import './index.css';

const MANAGER_NAV_ITEMS = [
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'teams',     label: 'Team',      icon: UsersRound },
  { id: 'email',     label: 'Email',     icon: Mail },
  { id: 'chat',      label: 'Chat',      icon: MessageSquare },
  { id: 'settings',  label: 'Settings',  icon: Settings },
];

const EMPLOYEE_NAV_ITEMS = [
  { id: 'onboarding',    label: 'My Dashboard', icon: UserPlus },
  { id: 'organization',  label: 'Team',          icon: UsersRound },
  { id: 'email',         label: 'Email',         icon: Mail },
  { id: 'chat',          label: 'Chat',          icon: MessageSquare },
  { id: 'settings',      label: 'Settings',      icon: Settings },
];

export default function App() {
  const [activeNav, setActiveNav]     = useState('home');
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('provision_employees');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Patch stale cached tasks: merge storyPoints from seed if missing
      return parsed.map(emp => {
        if (!emp.tasks) return emp;
        const seedTasks = JIRA_TASKS[emp.department] || [];
        const patched = emp.tasks.map(t => {
          if (t.storyPoints != null) return t; // already has points
          const seed = seedTasks.find(s => s.id === t.id);
          return seed ? { ...t, storyPoints: seed.storyPoints } : t;
        });
        return { ...emp, tasks: patched };
      });
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
    <div className="flex h-screen bg-surface-950 overflow-hidden">

      {/* ── Left Sidebar (Teams-style) ── */}
      <aside className="flex flex-col w-16 md:w-56 bg-surface-900 border-r border-surface-600 shrink-0 z-20">

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
                <span className="hidden md:block">{item.label}</span>
                {/* Tooltip on mobile */}
                <span className="absolute left-14 bg-surface-700 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap md:hidden z-50 border border-surface-500">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* User Profile (bottom of sidebar) */}
        <div className="p-4 border-t border-surface-600 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="hidden md:block overflow-hidden">
            <p className="text-white text-xs font-semibold truncate">{currentUser.name}</p>
            <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold truncate">{currentUser.type}</p>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Top bar */}
        <header className="h-14 bg-surface-900 border-b border-surface-600 flex items-center justify-between px-6 shrink-0 relative">
          <div className="flex items-center gap-3">
            {isPeekingEmployee && (
              <button onClick={handleBack} className="p-1 px-2 -ml-2 rounded hover:bg-surface-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium">
                <ArrowLeft size={14} /> Back
              </button>
            )}
            <div>
              <h1 className="text-white font-semibold text-sm">
                {headerTitle}
              </h1>
              <p className="text-slate-500 text-xs">
                {headerSubtitle}
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
        <main className="flex-1 overflow-y-auto">
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

            {!isPeekingEmployee && activeNav === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="p-8 text-slate-500 text-sm">Settings — coming soon.</div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
