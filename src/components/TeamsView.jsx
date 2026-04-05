import React from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronRight, Briefcase } from 'lucide-react';
import { calcProgress } from '../data';

export default function TeamsView({ employees, onViewEmployee, readOnly }) {
  // If no employees, just return a fallback
  if (!employees || employees.length === 0) {
    return <div className="p-8 text-center text-slate-500">No team members found.</div>;
  }

  // Define the Manager (we'll mock Sarah Johnson as the grand manager for this view)
  const manager = {
    name: 'Sarah Johnson',
    role: 'Engineering Director',
    initials: 'SJ',
    color: 'bg-primary-600'
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col items-center min-h-full">
      <div className="w-full mb-12">
        <h1 className="text-white text-2xl font-bold mb-1">Organization Chart</h1>
        <p className="text-slate-400 text-sm">Direct reporting structure for your team.</p>
      </div>

      <div className="flex flex-col items-center relative w-full overflow-x-auto pb-12 pt-8">
        {/* --- Top Manager Node --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="z-10"
        >
          <div className="bg-surface-800 border-2 border-primary-500/50 rounded-2xl w-64 p-5 flex flex-col items-center text-center shadow-2xl shadow-primary-500/10 relative">
            <div className="absolute -top-3 -right-3 bg-primary-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-lg">
              Manager
            </div>
            <div className={`w-16 h-16 ${manager.color} rounded-full flex items-center justify-center text-xl font-bold text-white mb-3 shadow-inner`}>
              {manager.initials}
            </div>
            <h2 className="text-white font-bold text-lg">{manager.name}</h2>
            <p className="text-primary-400 font-medium text-xs mb-1 mb-2">{manager.role}</p>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-2 bg-surface-900 border border-surface-600 px-3 py-1 rounded-lg">
              <Users size={12} /> {employees.length} Direct Reports
            </div>
          </div>
        </motion.div>

        {/* Vertical line connecting Manager down to the horizontal spine */}
        {employees.length > 0 && (
          <div className="w-px h-8 bg-surface-500" />
        )}

        {/* --- Direct Reports Row --- */}
        <div className="flex justify-center items-start min-w-min px-4">
          {employees.map((emp, i) => {
            const colors = ['bg-indigo-600','bg-violet-600','bg-pink-600','bg-teal-600','bg-amber-600','bg-rose-600','bg-sky-600'];
            const colorIdx = emp.name.charCodeAt(0) % colors.length;
            const color = colors[colorIdx];
            const initials = emp.name[0] + (emp.name.split(' ')[1]?.[0] || '');
            const progress = calcProgress(emp);
            const derivedStatus = progress === 100 ? 'Active' : 'Onboarding';

            return (
              <motion.div 
                key={emp.id} 
                className="flex flex-col items-center relative px-2 sm:px-4 shrink-0 transition-opacity"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Horizontal branchline */}
                {employees.length > 1 && (
                  <div className={`absolute top-0 h-[2px] bg-surface-500 ${
                     i === 0 ? 'left-1/2 right-0' :
                     i === employees.length - 1 ? 'left-0 right-1/2' :
                     'left-0 right-0'
                  }`} />
                )}
                
                {/* Vertical drop line down to card */}
                <div className="w-px h-8 bg-surface-500" />
                
                {/* Employee Card */}
                <div className="bg-surface-900 border border-surface-600 rounded-xl w-48 sm:w-56 p-4 flex flex-col items-center text-center shadow-lg hover:border-primary-500/50 hover:bg-surface-800 transition-all group">
                  <div className={`w-14 h-14 ${color} rounded-full flex items-center justify-center text-lg font-bold text-white mb-3 relative`}>
                    {initials}
                    {derivedStatus === 'Active' && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-surface-900 rounded-full" />
                    )}
                  </div>
                  
                  <h3 className="text-white font-semibold text-sm truncate w-full">{emp.name}</h3>
                  <p className="text-slate-400 text-xs truncate w-full mb-1">{emp.role}</p>
                  <p className="text-slate-500 text-[10px] font-medium tracking-wider uppercase flex items-center justify-center gap-1 truncate w-full">
                    <Briefcase size={10} /> {emp.department}
                  </p>

                  {!readOnly && (
                    <button
                      onClick={() => onViewEmployee(emp)}
                      className="mt-4 w-full bg-surface-700 hover:bg-primary-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1 opacity-0 focus:opacity-100 group-hover:opacity-100"
                    >
                      View Details <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
