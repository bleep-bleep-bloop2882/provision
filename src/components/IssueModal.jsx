import React, { useState } from 'react';
import { X, Check, Clock, User, AlertCircle, MessageSquare } from 'lucide-react';

export default function IssueModal({ task, onClose, onUpdate, onDelete, employee, readOnly }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title || '',
    description: task.description || 'No description provided.',
    status: task.status || 'To Do',
    priority: task.priority || 'Medium',
    type: task.type || 'Task',
    storyPoints: task.storyPoints || 0
  });
  const [comment, setComment] = useState('');

  const handleSave = () => {
    onUpdate({ ...task, ...formData });
    setEditing(false);
  };

  const handleStatusChange = (newStatus) => {
    setFormData(prev => ({ ...prev, status: newStatus }));
    onUpdate({ ...task, ...formData, status: newStatus });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-surface-900 h-full shadow-2xl flex flex-col border-l border-surface-600 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="h-14 border-b border-surface-600 px-6 flex flex-row items-center justify-between shrink-0 bg-surface-900">
          <div className="flex items-center gap-3">
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${
              formData.type === 'Bug' ? 'bg-red-500/20 text-red-400' :
              formData.type === 'Story' ? 'bg-green-500/20 text-green-400' :
              formData.type === 'Subtask' ? 'bg-fuchsia-500/20 text-fuchsia-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {formData.type}
            </span>
            <span className="text-slate-400 font-medium">{task.id}</span>
          </div>
          <div className="flex items-center gap-2">
            {(!readOnly || task.type === 'Subtask') && (
              <button onClick={() => onDelete(task.id)} className="btn-ghost p-1.5 px-3 text-xs text-red-500 hover:text-red-400 hover:bg-red-500/20">Delete</button>
            )}
            {!editing ? (
              <button onClick={() => setEditing(true)} className="btn-ghost p-1.5 px-3 text-xs">Edit</button>
            ) : (
              <>
                <button onClick={() => setEditing(false)} className="btn-ghost p-1.5 px-3 text-xs text-slate-400">Cancel</button>
                <button onClick={handleSave} className="btn-primary py-1.5 px-3 text-xs">Save</button>
              </>
            )}
            <button onClick={onClose} className="p-1.5 hover:bg-surface-700 rounded transition-colors text-slate-400"><X size={18} /></button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          
          <div className="flex flex-col gap-4">
            {!editing ? (
              <h2 className="text-2xl font-bold text-white">{formData.title}</h2>
            ) : (
              <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-surface-800 text-white font-bold text-xl p-3 border border-surface-600 rounded outline-none focus:border-primary-500"
              />
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column (Description & Comments) */}
            <div className="flex-1 flex flex-col gap-8">
              <section>
                <h3 className="text-sm font-semibold text-white mb-2">Description</h3>
                {!editing ? (
                  <div className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed bg-surface-800/50 p-4 rounded-lg border border-surface-700">
                    {formData.description}
                  </div>
                ) : (
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="w-full bg-surface-800 text-slate-200 text-sm p-3 border border-surface-600 rounded outline-none focus:border-primary-500 resize-y"
                  />
                )}
              </section>

              <section>
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><MessageSquare size={16}/> Comments</h3>
                <div className="flex gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary-900 border border-primary-500/30 flex items-center justify-center text-primary-300 font-bold shrink-0">{employee.name[0]}</div>
                  <div className="flex-1 flex flex-col items-end gap-2">
                    <input 
                      type="text" 
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full bg-surface-800 border border-surface-600 text-sm p-2.5 rounded-lg outline-none focus:border-primary-500 text-white"
                    />
                    <button disabled={!comment.trim()} className="btn-primary py-1 px-4 text-xs disabled:opacity-50">Save</button>
                  </div>
                </div>
                {/* Mock historical comment */}
                <div className="flex gap-3 mt-4">
                  <div className="w-8 h-8 rounded-full bg-surface-700 border border-surface-600 flex items-center justify-center text-slate-300 font-bold shrink-0">SJ</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-xs font-semibold">Sarah Johnson</span>
                      <span className="text-slate-500 text-[10px]">Yesterday at 4:12 PM</span>
                    </div>
                    <p className="text-slate-300 text-sm bg-surface-800 p-3 rounded-tr-xl rounded-b-xl border border-surface-700">This looks good, let's make sure it ties back to the epic.</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column (Properties sidebar) */}
            <div className="w-full md:w-64 flex flex-col gap-6 shrink-0">
              
              <div className="bg-surface-800 border border-surface-700 rounded-xl p-4 flex flex-col gap-4">
                
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5 block">Status</label>
                  {!editing ? (
                    <div className="bg-surface-900 border border-surface-600 text-sm font-medium text-white px-3 py-1.5 rounded w-fit flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${formData.status === 'Done' ? 'bg-green-500' : formData.status === 'In Progress' ? 'bg-blue-500' : 'bg-slate-500'}`} />
                      {formData.status}
                    </div>
                  ) : (
                    <select 
                      value={formData.status} 
                      onChange={e => handleStatusChange(e.target.value)} 
                      className="w-full bg-surface-900 border border-surface-600 text-white rounded p-1.5 outline-none text-sm"
                    >
                      <option>To Do</option>
                      <option>In Progress</option>
                      <option>In Review</option>
                      <option>Done</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5 block">Priority</label>
                  {!editing || readOnly ? (
                    <div className="flex items-center gap-1.5 text-sm text-slate-300">
                      <AlertCircle size={14} className={formData.priority === 'High' ? 'text-red-400' : 'text-blue-400'} />
                      {formData.priority}
                      {readOnly && editing && <span className="text-[10px] text-slate-500 italic ml-1">(Manager only)</span>}
                    </div>
                  ) : (
                    <select 
                      value={formData.priority} 
                      onChange={e => setFormData({...formData, priority: e.target.value})} 
                      className="w-full bg-surface-900 border border-surface-600 text-white rounded p-1.5 outline-none text-sm"
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5 block">Story Points</label>
                  {!editing || readOnly ? (
                    <div className="flex items-center gap-1.5 text-sm text-slate-300">
                      <span className="bg-surface-700 font-bold px-2 py-0.5 rounded text-xs">{formData.storyPoints}</span> pts
                      {readOnly && editing && <span className="text-[10px] text-slate-500 italic ml-1">(Manager only)</span>}
                    </div>
                  ) : (
                    <input 
                      type="number" 
                      min="0"
                      value={formData.storyPoints} 
                      onChange={e => setFormData({...formData, storyPoints: parseInt(e.target.value) || 0})} 
                      className="w-full bg-surface-900 border border-surface-600 text-white rounded p-1.5 outline-none text-sm"
                    />
                  )}
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5 block">Assignee</label>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <User size={14} className="text-slate-400"/> {employee.name}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5 block">Reporter</label>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <User size={14} className="text-slate-400"/> Sarah Johnson
                  </div>
                </div>

              </div>

              <div className="text-xs text-slate-500 flex flex-col gap-1.5 pb-4">
                <div className="flex items-center gap-1"><Clock size={12}/> Created 2 days ago</div>
                <div className="flex items-center gap-1"><Clock size={12}/> Updated just now</div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
