import React, { useState } from 'react';
import { User, Bell, Globe, Shield, Lock, Moon, Sun, Monitor, AlertCircle } from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { useLanguage } from '../LanguageProvider';

export default function SettingsView({ currentUser, setCurrentUser, setEmployees }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useLanguage();

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setCurrentUser(prev => ({ ...prev, avatar: base64 }));
        setEmployees(prev => prev.map(emp => emp.id === currentUser.id ? { ...emp, avatar: base64 } : emp));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
        <p className="text-slate-400 text-sm">Manage your account preferences and app behaviors.</p>
      </div>

      <div className="space-y-6">
        
        {/* Profile Card (Read Only) */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
            <User size={18} className="text-primary-400" /> Account Settings
          </h3>

          <div className="flex items-center gap-6 mb-8 pb-6 border-b border-surface-700">
            <div className="w-20 h-20 rounded-full bg-surface-700 ring-2 ring-surface-600 overflow-hidden shrink-0 flex items-center justify-center">
              {currentUser?.avatar ? <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <User size={32} className="text-slate-500" />}
            </div>
            <div>
              <h4 className="text-white text-sm font-medium mb-1">Profile Picture</h4>
              <p className="text-slate-500 text-xs mb-3">Upload a new avatar. JPG or PNG allowed.</p>
              <label className="btn-secondary cursor-pointer inline-flex outline-none">
                <span>Upload Image</span>
                <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleAvatarUpload} />
              </label>
            </div>
          </div>

          <div className="bg-surface-900/50 p-4 rounded-lg border border-surface-600 mb-6 flex items-start gap-3">
            <AlertCircle size={16} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">Your profile information is managed by your organization's IT department. Contact IT Support if you need to change your legal name or email address.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Full Name</label>
              <input type="text" className="input w-full opacity-60 cursor-not-allowed bg-surface-900 text-slate-300 font-medium" disabled value={currentUser?.name || ''} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Email Address</label>
              <input type="email" className="input w-full opacity-60 cursor-not-allowed bg-surface-900 text-slate-300" disabled value={currentUser?.email || ''} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Department</label>
              <input type="text" className="input w-full opacity-60 cursor-not-allowed bg-surface-900 text-slate-300" disabled value={currentUser?.department || ''} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Role / Title</label>
              <input type="text" className="input w-full opacity-60 cursor-not-allowed bg-surface-900 text-slate-300" disabled value={currentUser?.role || ''} />
            </div>
          </div>
        </div>

        {/* General App Settings */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
            <Globe size={18} className="text-primary-400" /> General App Settings
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-surface-700 pb-6">
              <div className="pr-4">
                <h4 className="text-white text-sm font-medium">Theme Preference</h4>
                <p className="text-slate-500 text-xs mt-1">Choose how the Provision platform looks for you.</p>
              </div>
              <div className="flex bg-surface-800 rounded-lg p-1 border border-surface-600 shrink-0">
                {['Light', 'Dark', 'System'].map(t => (
                  <button key={t} onClick={() => setTheme(t)} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${theme === t ? 'bg-primary-500 text-white' : 'text-slate-400 hover:text-white'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pb-2">
              <div>
                <h4 className="text-white text-sm font-medium">Language & Region</h4>
                <p className="text-slate-500 text-xs mt-1">Select your preferred display language.</p>
              </div>
              <select className="input bg-surface-800 appearance-none min-w-[140px] text-sm py-2" value={lang} onChange={(e) => setLang(e.target.value)}>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
            <Bell size={18} className="text-primary-400" /> Notifications & Alerts
          </h3>
          
          <div className="space-y-6">
            <label className="flex items-start justify-between cursor-pointer group">
              <div>
                <h4 className="text-white text-sm font-medium group-hover:text-primary-400 transition-colors">In-App Notifications</h4>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">Receive instant alerts for mentions, PR review requests, and JIRA task status changes directly inside the platform.</p>
              </div>
              <div className="relative inline-flex items-center mt-2 shrink-0 ml-4">
                <input type="checkbox" className="sr-only peer" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} />
                <div className="w-9 h-5 bg-surface-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
              </div>
            </label>

            <div className="h-px bg-surface-700 w-full"></div>

            <label className="flex items-start justify-between cursor-pointer group">
              <div>
                <h4 className="text-white text-sm font-medium group-hover:text-primary-400 transition-colors">Email Digests</h4>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">Get a daily digest of tasks, newly assigned tickets, and direct messages sent to your registered company email.</p>
              </div>
              <div className="relative inline-flex items-center mt-2 shrink-0 ml-4">
                <input type="checkbox" className="sr-only peer" checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
                <div className="w-9 h-5 bg-surface-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
              </div>
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}
