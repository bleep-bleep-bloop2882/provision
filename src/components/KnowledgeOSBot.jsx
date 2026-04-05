import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Search, FileText, ChevronRight, Zap, ArrowUp, Calendar as CalendarIcon, Clock, Users } from 'lucide-react';
import { searchKnowledgeBase } from '../knowledgeos';

export default function KnowledgeOSBot({ currentUser, employees, setEmployees, setMeetings }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', type: 'greeting', text: "Hi! I'm KnowledgeOS, your institutional AI assistant. Ask me anything about our engineering practices, contractor policies, or deployment schedules." }
  ]);
  const [inputTitle, setInputTitle] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleAssignTask = (taskDetails) => {
    const newTask = {
      id: `BOT-${Math.floor(Math.random() * 9000) + 1000}`,
      title: taskDetails.title,
      status: 'To Do',
      priority: taskDetails.priority,
      type: 'Task',
      storyPoints: taskDetails.storyPoints,
    };

    setEmployees(prev => prev.map(emp => {
      const currentTasks = emp.tasks || [];
      return { ...emp, tasks: [...currentTasks, newTask] };
    }));

    setMessages(prev => [...prev, { role: 'bot', text: `✅ Successfully pushed task "${taskDetails.title}" to ${employees.length} tracked employee dashboards.` }]);
  };

  const handleCreateMeeting = (meetingDetails) => {
    const newMeeting = {
      id: `BOT-MTG-${Math.floor(Math.random() * 9000) + 1000}`,
      title: meetingDetails.title,
      time: meetingDetails.time,
      type: 'video',
      participants: meetingDetails.participants,
      role: 'all', 
      dayOffset: 1, 
    };

    setMeetings(prev => [...prev, newMeeting]);

    setMessages(prev => [...prev, { role: 'bot', text: `✅ Successfully drafted a calendar invite for "${meetingDetails.title}" and pushed it to the schedule network.` }]);
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputTitle.trim()) return;

    const userQ = inputTitle;
    setMessages(prev => [...prev, { role: 'user', text: userQ }]);
    setInputTitle('');

    // Simulate RAG extraction lag
    setMessages(prev => [...prev, { role: 'bot', type: 'typing' }]);
    
    setTimeout(() => {
      const result = searchKnowledgeBase(userQ, { currentUser, employees });
      setMessages(prev => {
        const filtered = prev.filter(m => m.type !== 'typing');
        return [...filtered, { role: 'bot', type: 'rag', result }];
      });
    }, 600);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="fixed bottom-24 right-6 w-80 sm:w-[400px] h-[550px] max-h-[calc(100vh-140px)] bg-surface-900 border border-surface-600 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[60]">
            
            <div className="bg-primary-600 p-4 flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-2" style={{ color: '#ffffff' }}>
                <div className="bg-white/20 p-1.5 rounded-lg"><Zap size={16} className="fill-white" color="#ffffff" /></div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">KnowledgeOS</h3>
                  <p className="text-[10px] text-white/80 uppercase tracking-wider font-semibold">Institutional Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded transition-colors"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-950">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.type === 'typing' ? (
                    <div className="bg-surface-800 border border-surface-700 text-slate-300 p-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 w-16 h-10 shadow-sm">
                      <motion.div animate={{ y: [0,-3,0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      <motion.div animate={{ y: [0,-3,0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      <motion.div animate={{ y: [0,-3,0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                    </div>
                  ) : m.type === 'rag' ? (
                     <div className="bg-surface-800 border border-surface-700 p-3.5 rounded-2xl rounded-tl-sm max-w-[85%] space-y-3 shadow-sm">
                       <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                         {m.result.answer.split('\n\n> ').map((part, i) => i === 1 ? <span key={i} className="block mt-2 pl-3 border-l-2 border-primary-500 text-slate-300 bg-surface-900/50 p-2 rounded-r italic break-words">{part}</span> : part)}
                       </p>
                       
                       {m.result.type === 'action_meeting' && (
                         <div className="bg-surface-900 rounded-lg p-3 text-[11px] border border-surface-600 mt-2 shadow-inner">
                           <div className="flex items-center gap-2 font-bold text-white mb-2"><CalendarIcon size={14} className="text-primary-400" /> {m.result.meetingDetails.title}</div>
                           <div className="text-slate-400 mb-1.5 flex items-center gap-1.5"><Clock size={12} /> {m.result.meetingDetails.time}</div>
                           <div className="text-slate-400 mb-3 flex items-center gap-1.5"><Users size={12} /> {m.result.meetingDetails.participants.join(', ')}</div>
                           <div className="flex gap-2">
                             <button onClick={() => handleCreateMeeting(m.result.meetingDetails)} className="flex-1 bg-primary-600 hover:bg-primary-500 text-white rounded py-1.5 font-bold transition-colors shadow-lg">Send Invite</button>
                             <button className="flex-1 bg-surface-700 hover:bg-surface-600 text-slate-300 hover:text-white rounded py-1.5 font-bold transition-colors">Edit Details</button>
                           </div>
                         </div>
                       )}

                       {m.result.type === 'action_assign_task' && (
                         <div className="bg-surface-900 rounded-lg p-3 text-[11px] border border-primary-500/50 mt-2 shadow-inner">
                           <div className="flex items-start gap-2 font-bold text-white mb-2 leading-tight">
                             <FileText size={14} className="text-primary-400 shrink-0 mt-0.5" /> <div>New Jira Issue:<br/><span className="text-primary-300 font-medium text-[10px]">{m.result.taskDetails.title}</span></div>
                           </div>
                           <div className="text-slate-400 mb-1.5 flex items-center gap-1.5"><Users size={12} className="text-blue-400"/> Assignees: {m.result.taskDetails.assignees}</div>
                           <div className="text-slate-400 mb-3 flex items-center gap-4">
                             <span className="flex items-center gap-1.5"><Zap size={12} className="text-yellow-400" /> {m.result.taskDetails.priority} Priority</span>
                             <span>{m.result.taskDetails.storyPoints} Points</span>
                           </div>
                           <div className="flex gap-2">
                             <button onClick={() => handleAssignTask(m.result.taskDetails)} className="flex-1 bg-primary-600 hover:bg-primary-500 text-white rounded py-1.5 font-bold transition-colors shadow-lg flex items-center justify-center gap-1"><ArrowUp size={12}/> Bulk Assign</button>
                             <button className="flex-1 bg-surface-700 hover:bg-surface-600 text-slate-300 hover:text-white rounded py-1.5 font-bold transition-colors">Edit</button>
                           </div>
                         </div>
                       )}

                       {m.result.success && !m.result.type ? (
                         <div className="bg-surface-900 rounded p-2.5 text-[10px] text-slate-400 space-y-1.5 border border-surface-600">
                           <div className="flex items-center justify-between">
                             <span className="flex items-center gap-1 text-slate-300 truncate max-w-[70%]"><FileText size={10} className="text-primary-400 shrink-0" /> <span className="truncate">{m.result.document.title}</span></span>
                             <span className="text-green-400 font-medium shrink-0">{m.result.confidence}% Confident</span>
                           </div>
                           <div className="text-slate-500">Source: <span className="text-slate-300">{m.result.document.source}</span> • Updated {m.result.document.lastUpdated}</div>
                         </div>
                       ) : !m.result.success && (
                         <div className="bg-surface-900 rounded p-2.5 text-[11px] text-slate-300 border border-amber-500/30">
                           <div className="text-amber-400 font-medium mb-1 drop-shadow-sm flex items-center gap-1">⚠️ Low Confidence Map ({m.result.confidence}%)</div>
                           <p className="text-slate-400 leading-relaxed">This semantic gap is tracked. You can try asking <strong className="text-slate-200">@{m.result.expert.name}</strong> ({m.result.expert.role}) who owns this domain.</p>
                         </div>
                       )}
                     </div>
                  ) : (
                    <div className={`p-3 rounded-2xl max-w-[85%] shadow-sm text-sm leading-relaxed ${m.role === 'user' ? 'bg-primary-600 rounded-tr-sm' : 'bg-surface-800 border border-surface-700 text-slate-200 rounded-tl-sm'}`} style={m.role === 'user' ? { color: '#ffffff' } : {}}>
                      {m.text}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-surface-600 bg-surface-900 shrink-0">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input type="text" className="w-full bg-surface-950 border border-surface-700 text-white rounded-full pl-4 pr-11 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-shadow placeholder-slate-500" placeholder="Ask KnowledgeOS..." value={inputTitle} onChange={e => setInputTitle(e.target.value)} />
                <button type="submit" disabled={!inputTitle.trim()} className="absolute right-1.5 p-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-full disabled:opacity-50 disabled:hover:bg-primary-600 transition-colors">
                  <ArrowUp size={16} />
                </button>
              </form>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsOpen(!isOpen)} className={`fixed z-[60] w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-surface-800 text-slate-400 hover:text-white border border-surface-600' : 'bg-primary-600 text-white hover:bg-primary-500 shadow-primary-500/25'}`} style={{ bottom: '24px', right: '24px' }}>
        {isOpen ? <X size={24} /> : <Zap size={24} className="fill-white" />}
      </motion.button>
    </>
  );
}
