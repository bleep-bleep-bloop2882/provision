import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronDown, User, Mail, Calendar, Building2, Briefcase, Check, Shield, AlertTriangle } from 'lucide-react';
import { DEPARTMENTS, SYSTEMS, getPermissions } from '../data';

const LEVEL_CONFIG = {
  admin:   { label: 'Admin',    cls: 'level-admin',   rank: 4 },
  write:   { label: 'Read/Write',cls: 'level-write',  rank: 3 },
  read:    { label: 'Read Only', cls: 'level-read',   rank: 2 },
  granted: { label: 'Granted',   cls: 'level-granted', rank: 1 },
  none:    { label: 'No Access', cls: 'level-none',    rank: 0 },
};

function LevelBadge({ level }) {
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG.none;
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>;
}

// ─── Step 1 — Employee Details ─────────────────────────────────────────────
function Step1({ form, setForm }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-400 text-xs mb-1.5 font-medium">Full Name *</label>
          <div className="relative">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="input pl-8" placeholder="Jane Smith" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="block text-slate-400 text-xs mb-1.5 font-medium">Work Email *</label>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="input pl-8" placeholder="jane@acme.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-slate-400 text-xs mb-1.5 font-medium">Start Date *</label>
        <div className="relative">
          <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="date" className="input pl-8" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
        </div>
      </div>
    </div>
  );
}

// ─── Step 2 — Role Assignment ──────────────────────────────────────────────
function Step2({ form, setForm }) {
  const roles = form.department ? DEPARTMENTS[form.department] : [];
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-slate-400 text-xs mb-1.5 font-medium flex items-center gap-1"><Building2 size={12} /> Department *</label>
        <div className="relative">
          <select className="select" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value, role: '' }))}>
            <option value="">Select department…</option>
            {Object.keys(DEPARTMENTS).map(d => <option key={d}>{d}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
      </div>
      <div>
        <label className="block text-slate-400 text-xs mb-1.5 font-medium flex items-center gap-1"><Briefcase size={12} /> Role *</label>
        <div className="relative">
          <select className="select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} disabled={!form.department}>
            <option value="">{form.department ? 'Select role…' : 'Select a department first'}</option>
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {form.role && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl">
          <p className="text-xs text-primary-400 font-semibold mb-3 flex items-center gap-1"><Shield size={12} /> Auto-generated permissions preview for <strong>{form.role}</strong></p>
          <div className="grid grid-cols-2 gap-2">
            {SYSTEMS.slice(0, 6).map(sys => {
              const perms = getPermissions(form.role);
              const lvl = perms[sys.id] || 'none';
              if (lvl === 'none') return null;
              return (
                <div key={sys.id} className="flex items-center justify-between bg-surface-800 rounded-lg px-3 py-1.5">
                  <span className="text-slate-300 text-xs">{sys.icon} {sys.name}</span>
                  <LevelBadge level={lvl} />
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 mt-2">Full permissions on the next screen.</p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Step 3 — Review & Confirm ─────────────────────────────────────────────
function Step3({ form, editedPerms, setEditedPerms }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="card p-4 space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="text-white font-medium">{form.name}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="text-slate-300">{form.email}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Department</span><span className="text-white">{form.department}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Role</span><span className="text-primary-400 font-semibold">{form.role}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Start Date</span><span className="text-white">{form.startDate}</span></div>
      </div>

      {/* Editable permission table */}
      <div>
        <p className="text-xs text-slate-400 font-semibold mb-2 flex items-center gap-1"><Shield size={12} /> Permission Grants — click any row to adjust</p>
        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
          {SYSTEMS.map(sys => {
            const lvl = editedPerms[sys.id] || 'none';
            const isOpen = expanded === sys.id;
            return (
              <div key={sys.id} className="card overflow-hidden">
                <button className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-surface-700 transition-colors" onClick={() => setExpanded(isOpen ? null : sys.id)}>
                  <div className="flex items-center gap-2">
                    <span className="text-base">{sys.icon}</span>
                    <div className="text-left">
                      <p className="text-white text-sm font-medium">{sys.name}</p>
                      <p className="text-slate-500 text-xs">{sys.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <LevelBadge level={lvl} />
                    <ChevronDown size={14} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="px-3 pb-3 flex gap-2 flex-wrap border-t border-surface-600 pt-2">
                        {['none', 'read', 'write', 'granted', 'admin'].filter(l => sys.id !== 'vpn' && sys.id !== 'slack' || l !== 'admin').map(option => (
                          <button
                            key={option}
                            onClick={() => { setEditedPerms(p => ({ ...p, [sys.id]: option })); setExpanded(null); }}
                            className={`badge cursor-pointer ${option === lvl ? LEVEL_CONFIG[option].cls + ' ring-2 ring-offset-1 ring-offset-surface-700 ring-current' : 'bg-surface-600 text-slate-400 hover:bg-surface-500'}`}
                          >
                            {option === lvl && <Check size={10} />}
                            {LEVEL_CONFIG[option]?.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-warning-400/10 border border-warning-400/30 rounded-xl text-xs text-warning-400">
        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
        Provisioning will automatically send access invites to the employee\'s email and notify IT for system setup.
      </div>
    </div>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────────
const STEPS = ['Employee Details', 'Role Assignment', 'Review & Provision'];

export default function AddEmployeeModal({ onClose, onProvision }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', startDate: '', department: '', role: '' });
  const [editedPerms, setEditedPerms] = useState({});

  // When role changes, reset editedPerms to the role defaults
  const handleSetForm = (fn) => {
    setForm(prev => {
      const next = fn(prev);
      if (next.role !== prev.role) setEditedPerms(getPermissions(next.role));
      return next;
    });
  };

  const canNext = () => {
    if (currentStep === 0) return form.name && form.email && form.startDate;
    if (currentStep === 1) return form.department && form.role;
    return true;
  };

  const handleNext = () => {
    if (currentStep === 2) {
      onProvision({ ...form, permissions: editedPerms, status: 'Onboarding', id: Date.now(), acknowledged: [], watchedVideos: [], completedChecklist: [] });
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface-900 border border-surface-600 rounded-2xl w-full max-w-lg shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-600">
          <div>
            <h2 className="text-white font-bold text-lg">Add New Employee</h2>
            <p className="text-slate-500 text-sm">Step {currentStep + 1} of {STEPS.length} — {STEPS[currentStep]}</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5"><X size={18} /></button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-surface-600">
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-2">
                <div className={`step-dot ${i < currentStep ? 'done' : i === currentStep ? 'active' : 'idle'}`}>
                  {i < currentStep ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i === currentStep ? 'text-white' : i < currentStep ? 'text-success-400' : 'text-slate-600'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < currentStep ? 'bg-success-500' : 'bg-surface-600'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
              {currentStep === 0 && <Step1 form={form} setForm={setForm} />}
              {currentStep === 1 && <Step2 form={form} setForm={handleSetForm} />}
              {currentStep === 2 && <Step3 form={form} editedPerms={editedPerms} setEditedPerms={setEditedPerms} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-surface-600">
          <button onClick={() => currentStep === 0 ? onClose() : setCurrentStep(s => s - 1)} className="btn-ghost text-sm">
            {currentStep === 0 ? 'Cancel' : '← Back'}
          </button>
          <button onClick={handleNext} disabled={!canNext()} className={`btn-primary flex items-center gap-2 ${!canNext() ? 'opacity-40 cursor-not-allowed' : ''}`}>
            {currentStep === 2 ? (<><Shield size={15} /> Provision Access</>) : (<>Next <ChevronRight size={15} /></>)}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
