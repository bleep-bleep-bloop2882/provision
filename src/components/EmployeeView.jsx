
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, BookOpen, FolderOpen, BarChart3,
  CheckCircle2, Circle, ChevronDown, ChevronRight,
  ArrowLeft, Play, ExternalLink, Lock, Unlock,
  AlertTriangle, Check, AlignLeft, MoreHorizontal, User as UserIcon, LayoutList
} from 'lucide-react';
import { SYSTEMS, POLICIES, PROJECT_INTROS, getPermissions, calcProgress, JIRA_TASKS } from '../data';
import IssueModal from './IssueModal';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const LEVEL_CONFIG = {
  admin:   { label: 'Admin',     cls: 'level-admin',   icon: <Unlock size={11} /> },
  write:   { label: 'Read/Write',cls: 'level-write',   icon: <Unlock size={11} /> },
  read:    { label: 'Read Only', cls: 'level-read',    icon: <Unlock size={11} /> },
  granted: { label: 'Granted',   cls: 'level-granted', icon: <Check size={11} /> },
  none:    { label: 'No Access', cls: 'level-none',    icon: <Lock size={11} /> },
};

function LevelBadge({ level }) {
  const c = LEVEL_CONFIG[level] || LEVEL_CONFIG.none;
  return <span className={`badge ${c.cls} flex items-center gap-1`}>{c.icon}{c.label}</span>;
}

// ─── Access Panel ─────────────────────────────────────────────────────────────
function AccessPanel({ employee, setEmployee, readOnly }) {
  const perms = employee.permissions || getPermissions(employee.role);
  const granted = SYSTEMS.filter(s => (perms[s.id] || 'none') !== 'none');
  const blocked = SYSTEMS.filter(s => (perms[s.id] || 'none') === 'none');

  const handleToggleAccess = (sysId, currentLevel) => {
    if (readOnly) return;
    
    // Cycle logic: admin -> write -> read -> none -> admin
    // If the tool only has binary access (e.g., Slack), we might just toggle 'granted' / 'none'.
    // For simplicity, cycle through all valid states.
    const NEXT = { none: 'read', read: 'write', write: 'admin', admin: 'none', granted: 'none' };
    const newLvl = NEXT[currentLevel] || 'none';
    
    setEmployee(e => ({
      ...e,
      permissions: {
        ...(e.permissions || getPermissions(e.role)),
        [sysId]: newLvl
      }
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <p className="text-slate-400 text-sm">
          <span className="text-white font-semibold">{granted.length}</span> systems provisioned ·{' '}
          <span className="text-slate-500">{blocked.length} not granted</span>
        </p>
        {!readOnly && <span className="text-xs text-primary-400 uppercase tracking-wider font-bold">Click badge to edit</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SYSTEMS.map(sys => {
          const lvl = perms[sys.id] || 'none';
          const isGranted = lvl !== 'none';
          return (
            <div key={sys.id} className={`card p-4 flex items-center justify-between gap-3 transition-all ${isGranted ? 'border-surface-500' : 'opacity-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${isGranted ? 'bg-surface-700' : 'bg-surface-800'}`}>
                  {sys.icon}
                </div>
                <div>
                  <p className={`text-sm font-medium ${isGranted ? 'text-white' : 'text-slate-500'}`}>{sys.name}</p>
                  <p className="text-slate-600 text-xs">{sys.desc}</p>
                </div>
              </div>
              <button 
                onClick={() => handleToggleAccess(sys.id, lvl)}
                disabled={readOnly}
                className={`transition-transform ${!readOnly ? 'hover:scale-105 active:scale-95 cursor-pointer' : 'cursor-default'}`}
              >
                <LevelBadge level={lvl} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Policy Panel ─────────────────────────────────────────────────────────────
function PolicyPanel({ employee, setEmployee }) {
  const [expanded, setExpanded] = useState(null);

  const toggle = (policyId) => {
    const already = (employee.acknowledged || []).includes(policyId);
    setEmployee(e => ({
      ...e,
      acknowledged: already
        ? e.acknowledged.filter(id => id !== policyId)
        : [...(e.acknowledged || []), policyId],
    }));
  };

  return (
    <div className="space-y-3">
      <p className="text-slate-400 text-sm mb-4">
        Read each policy and acknowledge. Required policies must be completed before your first day ends.
      </p>
      {POLICIES.map(policy => {
        const done = (employee.acknowledged || []).includes(policy.id);
        const isOpen = expanded === policy.id;
        return (
          <motion.div key={policy.id} layout className={`policy-card ${done ? 'acknowledged' : ''}`}>
            <div className="flex items-start gap-3" onClick={() => setExpanded(isOpen ? null : policy.id)}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 ${done ? 'bg-green-900/40' : 'bg-surface-700'}`}>
                {policy.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium text-sm">{policy.title}</p>
                  {policy.required && <span className="badge bg-red-900/50 text-red-300">Required</span>}
                  {done && <span className="badge bg-green-900/50 text-green-300 flex items-center gap-1"><Check size={10} /> Done</span>}
                </div>
                <p className="text-slate-500 text-xs mt-0.5">{policy.readTime}</p>
              </div>
              <ChevronDown size={16} className={`text-slate-500 shrink-0 transition-transform mt-1 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="mt-4 pt-4 border-t border-surface-600">
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">{policy.summary}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggle(policy.id); }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        done
                          ? 'bg-green-900/40 text-green-300 border border-green-700/40'
                          : 'bg-primary-500 hover:bg-primary-600 text-white'
                      }`}
                    >
                      {done ? <><Check size={14} /> Acknowledged</> : <><Circle size={14} /> I have read and understood this</>}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Project Intro Panel ──────────────────────────────────────────────────────
function ProjectIntroPanel({ employee, setEmployee }) {
  const intro = PROJECT_INTROS[employee.department];
  if (!intro) return <p className="text-slate-500">No intro available for this department.</p>;

  const toggleVideo = (idx) => {
    setEmployee(e => {
      const watched = e.watchedVideos || [];
      return { ...e, watchedVideos: watched.includes(idx) ? watched.filter(i => i !== idx) : [...watched, idx] };
    });
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="card p-5">
        <h3 className="text-white font-semibold mb-2 text-sm flex items-center gap-2"><FolderOpen size={15} className="text-primary-400" /> Team Overview</h3>
        <p className="text-slate-300 text-sm leading-relaxed">{intro.overview}</p>
      </div>

      {/* Current sprint */}
      <div className="card p-5">
        <h3 className="text-white font-semibold mb-2 text-sm flex items-center gap-2"><BarChart3 size={15} className="text-blue-400" /> What's Happening Now</h3>
        <p className="text-slate-300 text-sm leading-relaxed">{intro.currentSprint}</p>
      </div>

      {/* Key tools */}
      <div className="card p-5">
        <h3 className="text-white font-semibold mb-3 text-sm flex items-center gap-2"><Shield size={15} className="text-purple-400" /> Key Tools & Channels</h3>
        <ul className="space-y-2">
          {intro.keyTools.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <ChevronRight size={14} className="text-primary-400 shrink-0 mt-0.5" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      {/* Watch First */}
      <div className="card p-5">
        <h3 className="text-white font-semibold mb-3 text-sm flex items-center gap-2"><Play size={15} className="text-green-400" /> Watch First</h3>
        <div className="space-y-2">
          {intro.watchFirst.map((v, i) => {
            const watched = (employee.watchedVideos || []).includes(i);
            return (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${watched ? 'border-green-700/40 bg-green-900/20' : 'border-surface-600 bg-surface-800 hover:border-surface-500'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${watched ? 'bg-green-900/50 text-green-300' : 'bg-surface-700 text-slate-400'}`}>
                    {watched ? <Check size={14} /> : <Play size={14} />}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${watched ? 'text-green-300' : 'text-white'}`}>{v.title}</p>
                    <p className="text-slate-500 text-xs">{v.duration}</p>
                  </div>
                </div>
                <button onClick={() => toggleVideo(i)} className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${watched ? 'border-green-700/40 text-green-400 hover:bg-green-900/20' : 'border-surface-500 text-slate-400 hover:text-white hover:border-slate-400'}`}>
                  {watched ? 'Undo' : 'Mark Watched'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Jira Tasks Panel ─────────────────────────────────────────────────────────
function JiraTasksPanel({ employee, setEmployee, readOnly, employees, setEmployees }) {
  const tasks = employee.tasks || JIRA_TASKS[employee.department] || [];

  const updateTasks = (newTasks) => {
    setEmployee(e => ({ ...e, tasks: newTasks }));
  };

  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', type: 'Task', priority: 'Medium', storyPoints: 3 });
  const [selectedTask, setSelectedTask] = useState(null);

  const handleUpdateTask = (updatedTask) => {
    let tasksToSave = [...tasks];
    let parentTask = { ...updatedTask };

    // Automated Subtask creation for QA exactly when moved to "In Review"
    if (parentTask.status === 'In Review') {
      
      // Check if ANY employee already has a subtask referencing this parent (prevents dupes)
      const qaExistsGlobally = employees ? employees.some(emp => 
        (emp.tasks || []).some(t => t.type === 'Subtask' && t.parentId === parentTask.id)
      ) : false;
      const qaExistsLocally = tasks.some(t => t.type === 'Subtask' && t.parentId === parentTask.id);

      if (!qaExistsGlobally && !qaExistsLocally) {
        const subtask = {
          id: `QA-${Math.floor(Math.random()*1000)+1000}`,
          title: `Tester QA: ${parentTask.title}`,
          type: 'Subtask',
          priority: 'High',
          status: 'To Do',
          storyPoints: 1,
          parentId: parentTask.id,
        };

        const testers = employees ? employees.filter(e => e.department === 'Testing') : [];
        const assignedTester = testers.length > 0 ? testers[0] : null;

        if (assignedTester && setEmployees) {
          // Route the ticket explicitly to the Testing department employee
          setEmployees(prev => prev.map(emp => {
            if (emp.id === assignedTester.id) {
              const currentTasks = emp.tasks || JIRA_TASKS[emp.department] || [];
              return { ...emp, tasks: [...currentTasks, subtask] };
            }
            return emp;
          }));
        } else {
          // Fallback if no testers exist in the company
          tasksToSave.push(subtask);
        }
      }
    }

    tasksToSave = tasksToSave.map(t => t.id === parentTask.id ? parentTask : t);
    updateTasks(tasksToSave);
    setSelectedTask(parentTask);
  };

  const handleDeleteTask = (deletedTaskId) => {
    updateTasks(tasks.filter(t => t.id !== deletedTaskId));
    setSelectedTask(null);
  };

  if (tasks.length === 0 && readOnly) {
    return <div className="card p-8 text-center text-slate-500">No Jira tasks currently assigned.</div>;
  }

  const columns = ['To Do', 'In Progress', 'In Review', 'Done'];

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    const taskObj = {
      id: `${employee.department.substring(0, 3).toUpperCase()}-${Math.floor(Math.random()*1000)+1000}`,
      title: newTask.title,
      type: newTask.type,
      priority: newTask.priority,
      status: 'To Do',
      storyPoints: newTask.storyPoints
    };
    updateTasks([...tasks, taskObj]);
    setIsAdding(false);
    setNewTask({ title: '', type: 'Task', priority: 'Medium', storyPoints: 3 });
  };

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div className="flex justify-end mb-2">
          <button onClick={() => setIsAdding(!isAdding)} className="btn-primary text-sm py-1.5 px-3 flex items-center gap-2">
            {isAdding ? 'Cancel' : '+ Create Task'}
          </button>
        </div>
      )}

      {isAdding && !readOnly && (
        <form onSubmit={handleCreateTask} className="bg-surface-800 border border-surface-600 rounded-xl p-4 mb-4 flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="Task Title..." 
            value={newTask.title} 
            onChange={e => setNewTask({...newTask, title: e.target.value})} 
            className="input w-full text-sm"
            autoFocus 
          />
          <div className="flex gap-3 items-center flex-wrap">
            <select value={newTask.type} onChange={e => setNewTask({...newTask, type: e.target.value})} className="input text-sm py-1.5 bg-surface-900 w-auto">
              <option value="Task">Task</option>
              <option value="Story">Story</option>
              <option value="Bug">Bug</option>
              <option value="Epic">Epic</option>
            </select>
            <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})} className="input text-sm py-1.5 bg-surface-900 w-auto">
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
            {newTask.type === 'Story' && (
              <div className="flex items-center gap-2">
                <label className="text-slate-400 text-sm">Points:</label>
                <input 
                  type="number" 
                  min="1" 
                  max="21" 
                  value={newTask.storyPoints} 
                  onChange={e => setNewTask({...newTask, storyPoints: parseInt(e.target.value) || 0})} 
                  className="input text-sm py-1.5 bg-surface-900 w-16"
                />
              </div>
            )}
            <button type="submit" disabled={!newTask.title.trim()} className="btn-primary py-1.5 px-4 text-sm ml-auto disabled:opacity-50">Save</button>
          </div>
        </form>
      )}

      {tasks.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">No Jira tasks currently assigned.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map(col => {
            const colTasks = tasks.filter(t => t.status === col);
            return (
              <div key={col} className="bg-surface-900 border border-surface-600 rounded-xl p-3 flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h4 className="text-white font-semibold text-sm">{col}</h4>
                  <span className="bg-surface-700 text-slate-400 text-xs px-2 py-0.5 rounded-full font-medium">{colTasks.length}</span>
                </div>

            
            <div className="flex flex-col gap-2 flex-1">
              {colTasks.map(task => (
                <div key={task.id} onClick={() => setSelectedTask(task)} className="bg-surface-800 border border-surface-600 rounded-lg p-3 hover:border-surface-500 transition-colors cursor-pointer shadow-sm hover:shadow-md">
                  <div className="text-slate-300 text-sm font-medium mb-3 leading-snug">{task.title}</div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                          task.type === 'Bug' ? 'bg-red-500/20 text-red-400' :
                          task.type === 'Story' ? 'bg-green-500/20 text-green-400' :
                          task.type === 'Subtask' ? 'bg-fuchsia-500/20 text-fuchsia-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {task.type}
                        </span>
                        {task.storyPoints != null && (
                          <span className="bg-surface-700 text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1" title="Story Points">
                            {task.storyPoints} pts
                          </span>
                        )}
                        {task.parentId && (
                          <span className="text-[10px] text-slate-500 font-bold ml-1" title={`Linked to ${task.parentId}`}>
                            ↳ {task.parentId}
                          </span>
                        )}
                      </div>
                      <span className="text-slate-500 text-xs font-medium">{task.id}</span>
                    </div>
                    
                    {/* Fake action buttons to move task for functional feeling */}
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      {col !== 'To Do' && (
                        <button onClick={(e) => { e.stopPropagation(); updateTasks(tasks.map(t => t.id === task.id ? {...t, status: columns[columns.indexOf(col)-1]} : t)); }} className="text-slate-400 hover:text-white p-1 bg-surface-700 rounded">&lt;</button>
                      )}
                      {col !== 'Done' && (
                        <button onClick={(e) => { e.stopPropagation(); updateTasks(tasks.map(t => t.id === task.id ? {...t, status: columns[columns.indexOf(col)+1]} : t)); }} className="text-slate-400 hover:text-white p-1 bg-surface-700 rounded">&gt;</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
        </div>
      )}

      {selectedTask && (
        <IssueModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
          onUpdate={handleUpdateTask} 
          onDelete={handleDeleteTask}
          employee={employee}
          readOnly={readOnly}
        />
      )}
    </div>
  );
}

// ─── Progress Panel ───────────────────────────────────────────────────────────
function ProgressSection({ employee }) {
  const progress = calcProgress(employee);
  const policyDone = POLICIES.filter(p => (employee.acknowledged || []).includes(p.id)).length;
  const intro = PROJECT_INTROS[employee.department];
  const videoDone = (employee.watchedVideos || []).length;
  const videoTotal = intro?.watchFirst?.length || 0;

  const tasks = employee.tasks || JIRA_TASKS[employee.department] || [];
  const pointsDone       = tasks.filter(t => t.status === 'Done').reduce((s, t) => s + (Number(t.storyPoints) || 0), 0);
  const pointsInProgress = tasks.filter(t => t.status === 'In Progress').reduce((s, t) => s + Math.floor((Number(t.storyPoints) || 0) / 2), 0);
  const pointsEarned     = pointsDone + pointsInProgress;

  const done = tasks.filter(t => t.status === 'Done').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const todo = tasks.filter(t => t.status === 'To Do').length;

  const radius = 36;
  const circum = 2 * Math.PI * radius;
  const taskTotal = tasks.length || 1;

  const todoLen = (todo / taskTotal) * circum;
  const inProgLen = (inProgress / taskTotal) * circum;
  const doneLen = (done / taskTotal) * circum;

  const angle1 = 0;
  const angle2 = (todo / taskTotal) * 360;
  const angle3 = angle2 + (inProgress / taskTotal) * 360;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Onboarding Donut */}
      <div className="card p-6 flex flex-col items-center justify-center">
        <div className="w-full flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-sm">Onboarding Progress</h3>
          {progress === 100 && <span className="badge bg-green-900/60 text-green-300"><CheckCircle2 size={12} className="inline mr-1" />Complete</span>}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-8 w-full justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r={radius} fill="transparent" strokeWidth="6" className="text-surface-700" stroke="currentColor" />
              <circle cx="40" cy="40" r={radius} fill="transparent" strokeWidth="6" className={progress >= 100 ? 'text-green-500' : 'text-primary-500'} stroke="currentColor" strokeDasharray={`${(progress / 100) * circum} ${circum}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease-in-out' }} />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{progress}%</span>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-2 w-full sm:w-32">
            <div className="flex flex-col bg-surface-800 border border-surface-600 rounded-lg p-2 px-2.5">
              <span className="text-[11px] text-slate-400 mb-0.5 uppercase tracking-wide font-bold">Policies</span>
              <span className="text-sm text-white font-semibold flex justify-between"><span>{policyDone} / {POLICIES.length}</span> <span className="text-slate-500 text-xs mt-0.5">Done</span></span>
            </div>
            <div className="flex flex-col bg-surface-800 border border-surface-600 rounded-lg p-2 px-2.5">
              <span className="text-[11px] text-slate-400 mb-0.5 uppercase tracking-wide font-bold">Videos</span>
              <span className="text-sm text-white font-semibold flex justify-between"><span>{videoDone} / {videoTotal}</span> <span className="text-slate-500 text-xs mt-0.5">Done</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Task Donut */}
      <div className="card p-6 flex flex-col items-center justify-center">
        <h3 className="text-white font-semibold text-sm mb-4 self-start">Sprint Tasks Activity</h3>
        <div className="flex flex-col sm:flex-row items-center gap-8 w-full justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
            {tasks.length === 0 ? (
              <div className="w-full h-full rounded-full border-[6px] border-surface-700 flex items-center justify-center text-slate-500 text-sm p-4">0 Tasks</div>
            ) : (
              <>
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r={radius} fill="transparent" strokeWidth="6" className="text-surface-700" stroke="currentColor" />
                  {todo > 0 && <circle cx="40" cy="40" r={radius} fill="transparent" strokeWidth="6" className="text-slate-500" stroke="currentColor" strokeDasharray={`${todoLen} ${circum}`} strokeDashoffset={0} transform={`rotate(${angle1} 40 40)`} />}
                  {inProgress > 0 && <circle cx="40" cy="40" r={radius} fill="transparent" strokeWidth="6" className="text-blue-500" stroke="currentColor" strokeDasharray={`${inProgLen} ${circum}`} strokeDashoffset={0} transform={`rotate(${angle2} 40 40)`} />}
                  {done > 0 && <circle cx="40" cy="40" r={radius} fill="transparent" strokeWidth="6" className="text-green-500" stroke="currentColor" strokeDasharray={`${doneLen} ${circum}`} strokeDashoffset={0} transform={`rotate(${angle3} 40 40)`} />}
                </svg>
                <div className="absolute flex flex-col items-center justify-center bg-surface-900 rounded-full w-20 h-20 shadow-inner">
                  <span className="text-2xl font-bold text-white">{tasks.length}</span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Tasks</span>
                </div>
              </>
            )}
          </div>
          
          <div className="flex flex-col justify-center gap-3 w-full sm:w-auto">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <span className="w-3 h-3 rounded-sm bg-green-500 shrink-0"></span> Done
              </div>
              <span className="font-bold text-white shadow-sm">{done}</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <span className="w-3 h-3 rounded-sm bg-blue-500 shrink-0"></span> Active
              </div>
              <span className="font-bold text-white shadow-sm">{inProgress}</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <span className="w-3 h-3 rounded-sm bg-slate-500 shrink-0"></span> To Do
              </div>
              <span className="font-bold text-white shadow-sm">{todo}</span>
            </div>
            <div className="flex items-center justify-between gap-6 pt-2 mt-1 border-t border-surface-600">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-sm bg-fuchsia-500 shrink-0"></span>
                <span className="text-fuchsia-300 font-semibold">Points</span>
              </div>
              <span className="font-bold text-fuchsia-300">{pointsEarned} pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Employee View ───────────────────────────────────────────────────────
const TABS = [
  { id: 'access',   label: 'Access',         icon: <Shield size={15} /> },
  { id: 'policies', label: 'Company Policy', icon: <BookOpen size={15} /> },
  { id: 'project',  label: 'Project Intro',  icon: <FolderOpen size={15} /> },
  { id: 'tasks',    label: 'Assigned Tasks', icon: <LayoutList size={15} /> },
];

export default function EmployeeView({ employee: initialEmployee, employees, setEmployees, onBack, readOnly }) {
  const [activeTab, setActiveTab] = useState('access');

  // Keep employee in sync with global list
  const employee = employees.find(e => e.id === initialEmployee.id) || initialEmployee;
  const setEmployee = (fn) => setEmployees(prev => prev.map(e => e.id === employee.id ? (typeof fn === 'function' ? fn(e) : fn) : e));

  const dept = employee.department;
  const colors = ['bg-indigo-600','bg-violet-600','bg-pink-600','bg-teal-600','bg-amber-600'];
  const color = colors[employee.name.charCodeAt(0) % colors.length];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back */}
      {!readOnly && (
        <button onClick={onBack} className="btn-ghost flex items-center gap-1.5 mb-6 -ml-2 text-sm">
          <ArrowLeft size={16} /> Back to team
        </button>
      )}

      {/* Employee header */}
      {!readOnly ? (
        <div className="card p-6 mb-6 flex items-start gap-4">
          <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0`}>
            {employee.name[0]}{employee.name.split(' ')[1]?.[0] || ''}
          </div>
          <div className="flex-1">
            <h2 className="text-white font-bold text-2xl mb-1">{employee.name}</h2>
            <p className="text-primary-400 text-sm font-medium mb-3">{employee.role} — {employee.department}</p>
            <div className="flex items-center gap-3 text-xs">
              <span className="bg-surface-800 text-slate-300 px-2.5 py-1 rounded-lg border border-surface-600 flex items-center gap-1.5"><UserIcon size={12} className="text-slate-500" /> {employee.email}</span>
              <span className="bg-surface-800 text-slate-300 px-2.5 py-1 rounded-lg border border-surface-600">Started {employee.startDate}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <h2 className="text-white font-bold text-2xl tracking-tight">Hi, {employee.name.split(' ')[0]}</h2>
        </div>
      )}

      {/* Progress */}
      <ProgressSection employee={employee} />

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-800 border border-surface-600 rounded-xl p-1 mb-6 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-primary-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {activeTab === 'access'   && <AccessPanel employee={employee} setEmployee={setEmployee} readOnly={readOnly} />}
          {activeTab === 'policies' && <PolicyPanel employee={employee} setEmployee={setEmployee} />}
          {activeTab === 'project'  && <ProjectIntroPanel employee={employee} setEmployee={setEmployee} />}
          {activeTab === 'tasks'    && <JiraTasksPanel employee={employee} setEmployee={setEmployee} readOnly={readOnly} employees={employees} setEmployees={setEmployees} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
