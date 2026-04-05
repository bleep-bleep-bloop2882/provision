import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search, Users, Clock, CheckCircle2, AlertCircle, Eye, Trash2, Building2, ChevronRight, ChevronDown, LayoutList } from 'lucide-react';
import { calcProgress, JIRA_TASKS } from '../data';
import AddEmployeeModal from './AddEmployeeModal';

const STATUS_CONFIG = {
  Active:     { cls: 'bg-green-900/60 text-green-300', icon: <CheckCircle2 size={11} /> },
  Onboarding: { cls: 'bg-blue-900/60 text-blue-300',   icon: <Clock size={11} /> },
  Pending:    { cls: 'bg-yellow-900/60 text-yellow-300',icon: <AlertCircle size={11} /> },
};

function Avatar({ name, dept, size = 'md' }) {
  const colors = ['bg-indigo-600','bg-violet-600','bg-pink-600','bg-teal-600','bg-amber-600','bg-rose-600','bg-sky-600'];
  const idx = name.charCodeAt(0) % colors.length;
  const s = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm';
  return <div className={`${s} ${colors[idx]} rounded-full flex items-center justify-center font-bold text-white shrink-0`}>{name[0]}{name.split(' ')[1]?.[0]}</div>;
}

export default function ManagerView({ employees, setEmployees, onViewEmployee }) {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (id) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const depts = ['All', ...new Set(employees.map(e => e.department))];

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === 'All' || e.department === filterDept;
    return matchSearch && matchDept;
  });

  const handleProvision = (newEmp) => {
    setEmployees(prev => [{ ...newEmp, id: Date.now() }, ...prev]);
    setShowModal(false);
  };

  const handleDelete = (id) => setEmployees(prev => prev.filter(e => e.id !== id));

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'Active').length,
    onboarding: employees.filter(e => e.status === 'Onboarding').length,
    pending: employees.filter(e => e.status === 'Pending').length,
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Employees', value: stats.total, icon: <Users size={18} />, color: 'text-primary-400' },
          { label: 'Active',     value: stats.active,     icon: <CheckCircle2 size={18} />, color: 'text-green-400' },
          { label: 'Onboarding', value: stats.onboarding, icon: <Clock size={18} />,       color: 'text-blue-400'  },
          { label: 'Pending',    value: stats.pending,    icon: <AlertCircle size={18} />,  color: 'text-yellow-400'},
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className={`${s.color} mb-2`}>{s.icon}</div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="input pl-9 w-full" placeholder="Search employees or roles…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {depts.map(d => (
            <button key={d} onClick={() => setFilterDept(d)} className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${filterDept === d ? 'bg-primary-500 border-primary-500 text-white' : 'border-surface-500 text-slate-400 hover:text-white hover:border-slate-400'}`}>{d}</button>
          ))}
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-1.5 whitespace-nowrap">
          <UserPlus size={15} /> Add Employee
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-600 text-slate-500 text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3">Employee</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Department</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Role</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Start Date</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Tasks</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((emp, idx) => {
                const employeeTasks = emp.tasks || JIRA_TASKS[emp.department] || [];
                const doneTasks = employeeTasks.filter(t => t.status === 'Done').length;
                const activeTasks = employeeTasks.filter(t => t.status === 'In Progress').length;
                const totalTasks = employeeTasks.length;
                const progress = calcProgress(emp);
                const derivedStatus = progress === 100 ? 'Active' : 'Onboarding';
                const statusCfg = STATUS_CONFIG[derivedStatus] || STATUS_CONFIG.Onboarding;
                return (
                  <React.Fragment key={emp.id}>
                    <motion.tr
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.04 }}
                      className="border-b border-surface-700/50 hover:bg-surface-800/60 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <button onClick={() => toggleRow(emp.id)} className="p-1 text-slate-500 hover:text-white transition-colors hover:bg-surface-700 rounded mr-1">
                            {expandedRows.has(emp.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                          <Avatar name={emp.name} dept={emp.department} />
                          <div>
                            <p className="text-white font-medium">{emp.name}</p>
                            <p className="text-slate-500 text-xs">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Building2 size={13} />
                        <span>{emp.department}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="text-slate-300">{emp.role}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-slate-500 text-xs">{emp.startDate}</td>
                    <td className="px-4 py-3.5">
                      <span className={`badge ${statusCfg.cls} flex items-center gap-1 w-fit`}>
                        {statusCfg.icon}{derivedStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white text-xs font-semibold">{doneTasks}/{totalTasks}</span>
                        <span className="text-xs text-slate-500">done</span>
                        {activeTasks > 0 && (
                          <span className="text-xs text-blue-400 bg-blue-500/10 px-1.5 rounded ml-1">
                            {activeTasks} active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => onViewEmployee(emp)} className="btn-ghost p-1.5 text-xs flex items-center gap-1">
                          <Eye size={14} /> <span className="hidden md:block">View</span>
                        </button>
                        <button onClick={() => handleDelete(emp.id)} className="btn-ghost p-1.5 text-danger-400 hover:text-danger-400 hover:bg-red-900/20">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                  {expandedRows.has(emp.id) && (
                    <tr className="bg-surface-900/40 border-b border-surface-700/50">
                      <td colSpan={7} className="px-5 py-4 pl-16">
                        <div className="flex items-center gap-2 mb-3">
                          <LayoutList size={14} className="text-primary-400" />
                          <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Current Sprint Tasks</h4>
                        </div>
                        {(!emp.tasks && !JIRA_TASKS[emp.department]) || (emp.tasks || JIRA_TASKS[emp.department]).length === 0 ? (
                          <p className="text-slate-500 text-sm">No tasks assigned.</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {(emp.tasks || JIRA_TASKS[emp.department]).map(task => (
                              <div key={task.id} className="bg-surface-800 border border-surface-600 rounded-lg p-3">
                                <p className="text-slate-300 text-sm font-medium mb-2 leading-snug">{task.title}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                                      task.type === 'Bug' ? 'bg-red-500/20 text-red-400' :
                                      task.type === 'Story' ? 'bg-green-500/20 text-green-400' :
                                      'bg-blue-500/20 text-blue-400'
                                    }`}>
                                      {task.type}
                                    </span>
                                    {task.type === 'Story' && task.storyPoints && (
                                      <span className="bg-surface-700 text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1" title="Story Points">
                                        {task.storyPoints} pts
                                      </span>
                                    )}
                                  </div>
                                  <span className={`text-xs font-medium ${
                                    task.status === 'Done' ? 'text-green-400' :
                                    task.status === 'In Progress' ? 'text-blue-400' :
                                    'text-slate-500'
                                  }`}>{task.status}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
                );
              })}
            </AnimatePresence>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center text-slate-600 py-12">No employees found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && <AddEmployeeModal onClose={() => setShowModal(false)} onProvision={handleProvision} />}
      </AnimatePresence>
    </div>
  );
}
