import React from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function HomeView({ employees }) {
  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'Active').length,
    onboarding: employees.filter(e => e.status === 'Onboarding').length,
    pending: employees.filter(e => e.status === 'Pending').length,
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-white text-2xl font-bold mb-1">Welcome back, Manager</h1>
        <p className="text-slate-400 text-sm">Here's what's happening with your team today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: stats.total, icon: <Users size={20} />, color: 'text-primary-400', bg: 'bg-primary-500/10' },
          { label: 'Active', value: stats.active, icon: <CheckCircle2 size={20} />, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Onboarding', value: stats.onboarding, icon: <Clock size={20} />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Pending Access', value: stats.pending, icon: <AlertCircle size={20} />, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        ].map((s, idx) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card p-5"
          >
            <div className={`${s.bg} ${s.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
            <div className="text-slate-500 text-sm font-medium">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity placeholder / call to action */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6 border-dashed border-surface-500/50 flex flex-col items-center justify-center text-center py-12"
      >
        <div className="w-16 h-16 bg-surface-800 rounded-full flex items-center justify-center text-slate-500 mx-auto mb-4">
          <Clock size={24} />
        </div>
        <h3 className="text-white font-medium text-lg mb-2">No recent activity</h3>
        <p className="text-slate-400 text-sm max-w-sm mx-auto">
          When employees complete training or acknowledge policies, their progress will appear here.
        </p>
      </motion.div>
    </div>
  );
}
