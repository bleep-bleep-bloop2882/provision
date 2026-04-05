import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Calendar, AlertCircle, CheckCircle2, Video, BookOpen, Clock } from 'lucide-react';
import { POLICIES, PROJECT_INTROS } from '../data';

export default function NotificationsPopover({ mode, employee, employees, onClose }) {
  const ref = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Generate Employee Notifications (Pending tasks)
  const getEmployeeTasks = () => {
    if (!employee) return [];
    const tasks = [];
    
    // Policies
    POLICIES.forEach(p => {
      if (!(employee.acknowledged || []).includes(p.id) && p.required) {
        tasks.push({
          id: `pol-${p.id}`,
          icon: <BookOpen size={16} className="text-blue-400" />,
          title: 'Pending Policy Acknowledgment',
          desc: `Please read and acknowledge the ${p.title}.`,
          time: 'Action required'
        });
      }
    });

    // Videos
    const intro = PROJECT_INTROS[employee.department];
    if (intro && intro.watchFirst) {
      intro.watchFirst.forEach((v, idx) => {
        if (!(employee.watchedVideos || []).includes(idx)) {
          tasks.push({
            id: `vid-${idx}`,
            icon: <Video size={16} className="text-purple-400" />,
            title: 'Required Video',
            desc: `Watch "${v.title}" (${v.duration}).`,
            time: 'Action required'
          });
        }
      });
    }

    return tasks;
  };

  // Generate Manager Notifications (Meetings + Employee Summaries)
  const getManagerNotifications = () => {
    const notifs = [
      {
        id: 'mtg-1',
        icon: <Calendar size={16} className="text-primary-400" />,
        title: 'Upcoming Meeting',
        desc: 'Weekly Leadership Sync',
        time: 'In 15 mins'
      },
      {
        id: 'mtg-2',
        icon: <Calendar size={16} className="text-primary-400" />,
        title: 'Upcoming Meeting',
        desc: '1:1 Calibration with HR',
        time: 'In 2 hours'
      }
    ];

    const pendingCount = employees.filter(e => e.status === 'Onboarding' || e.status === 'Pending').length;
    if (pendingCount > 0) {
      notifs.push({
        id: 'emp-1',
        icon: <AlertCircle size={16} className="text-yellow-400" />,
        title: 'Pending Onboarding Tasks',
        desc: `${pendingCount} employees have incomplete setup tasks.`,
        time: 'Needs attention'
      });
    }

    return notifs;
  };

  const items = mode === 'employee' ? getEmployeeTasks() : getManagerNotifications();

  return (
    <div ref={ref} className="absolute top-12 right-6 z-50 w-80">
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="bg-surface-800 border border-surface-600 shadow-2xl rounded-xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-600 bg-surface-900/50">
          <h3 className="text-white font-semibold flex items-center gap-2 text-sm">
            <Bell size={14} className="text-slate-400" /> Notifications
          </h3>
          <span className="bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {items.length} New
          </span>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <CheckCircle2 size={24} className="text-slate-600 mb-2" />
              <p className="text-slate-400 text-sm">You are all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-700/50">
              {items.map(item => (
                <div key={item.id} className="p-4 hover:bg-surface-700/30 transition-colors flex gap-3 items-start cursor-pointer">
                  <div className="mt-0.5 p-1.5 bg-surface-900 rounded-lg border border-surface-700 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium leading-tight mb-1">{item.title}</h4>
                    <p className="text-slate-400 text-xs mb-1.5 leading-snug">{item.desc}</p>
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1">
                      <Clock size={10} /> {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {items.length > 0 && (
          <div className="p-2 border-t border-surface-600 bg-surface-900/30">
            <button
              onClick={onClose}
              className="w-full py-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Mark all as read
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
