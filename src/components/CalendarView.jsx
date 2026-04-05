import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Users, Video, MapPin, ChevronLeft, ChevronRight, Plus, Check, X } from 'lucide-react';

export default function CalendarView({ currentUser, meetings = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meetingState, setMeetingState] = useState({});

  const handleRsvp = (id, status) => setMeetingState(prev => ({ ...prev, [id]: status }));

  const today = new Date();
  
  const MOCK_MEETINGS = [
    { id: 1, title: 'Engineering Daily Standup', time: '10:00 AM - 10:30 AM', type: 'video', participants: ['Sarah Johnson', 'Alex Rivera', 'Priya Nair'], role: 'all' },
    { id: 2, title: '1:1 with Manager', time: '1:00 PM - 1:45 PM', type: 'video', participants: ['Sarah Johnson', currentUser.name], role: 'employee' },
    { id: 3, title: 'Q3 Roadmap Planning', time: '3:00 PM - 4:30 PM', type: 'room', location: 'Conference Room B', participants: ['Sarah Johnson', 'Jordan Lee'], role: 'manager' },
    { id: 4, title: 'All Hands Meeting', time: '9:00 AM - 10:00 AM', type: 'video', participants: ['Everyone'], role: 'all', dayOffset: 1 },
    { id: 5, title: 'Design Review Sync', time: '2:00 PM - 3:00 PM', type: 'video', participants: ['Morgan Chen', currentUser.name], role: 'employee', dayOffset: -1 },
  ];

  const isManager = currentUser.type === 'manager';
  
  const combinedMeetings = [...MOCK_MEETINGS, ...meetings];
  const myMeetings = combinedMeetings.filter(m => m.role === 'all' || (isManager && m.role === 'manager') || (!isManager && m.role === 'employee' || m.participants.includes(currentUser.name)));

  const nextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const prevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const isSameDay = (d1, offset) => {
    const d2 = new Date();
    d2.setDate(d2.getDate() + (offset || 0));
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  const todaysMeetings = myMeetings.filter(m => isSameDay(currentDate, m.dayOffset));

  return (
    <div className="p-6 max-w-5xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><CalendarIcon className="text-primary-400" /> Calendar</h2>
          <p className="text-slate-400 text-sm">Review your daily schedule and upcoming meetings.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Meeting
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        <div className="flex-1 flex flex-col min-h-0 bg-surface-900 rounded-2xl border border-surface-600 overflow-hidden">
          <div className="p-4 border-b border-surface-600 bg-surface-800/50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <button onClick={prevDay} className="p-1.5 hover:bg-surface-700 text-slate-400 hover:text-white rounded-md transition-colors"><ChevronLeft size={18} /></button>
              <h3 className="text-white font-bold text-lg min-w-[150px] text-center">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              <button onClick={nextDay} className="p-1.5 hover:bg-surface-700 text-slate-400 hover:text-white rounded-md transition-colors"><ChevronRight size={18} /></button>
            </div>
            
            <button onClick={() => setCurrentDate(new Date())} className="btn-ghost text-xs px-3 py-1.5 border border-surface-600">Today</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {todaysMeetings.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
                <CalendarIcon size={48} className="opacity-20" />
                <p>No meetings scheduled for this day.</p>
              </div>
            ) : (
              todaysMeetings.map(m => (
                <div key={m.id} className={`card p-4 hover:border-primary-500/50 transition-colors border-l-4 ${meetingState[m.id] === 'declined' ? 'border-l-red-500/50 opacity-60' : 'border-l-primary-500'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h4 className={`font-bold text-base ${meetingState[m.id] === 'declined' ? 'text-slate-500 line-through' : 'text-white'}`}>{m.title}</h4>
                    <span className="text-xs font-semibold bg-surface-700 text-white px-2 py-1 rounded-md flex items-center gap-1.5">
                      <Clock size={12} className="text-primary-400" /> {m.time}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <div className="flex items-center gap-1.5">
                      {m.type === 'video' ? <Video size={14} className="text-blue-400" /> : <MapPin size={14} className="text-green-400" />}
                      <span>{m.type === 'video' ? 'Zoom Call' : m.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-purple-400" />
                      <span>{m.participants.join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-t border-surface-600 pt-3">
                    {meetingState[m.id] === 'declined' ? (
                      <>
                         <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded font-medium flex items-center gap-1"><X size={12}/> Declined</span>
                         <button onClick={() => handleRsvp(m.id, null)} className="text-[10px] text-slate-500 hover:text-slate-300 ml-2">Undo</button>
                      </>
                    ) : meetingState[m.id] === 'accepted' ? (
                      <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded font-medium flex items-center gap-1"><Check size={12}/> Accepted</span>
                    ) : (
                      <>
                        <button onClick={() => handleRsvp(m.id, 'accepted')} className="text-xs font-semibold px-3 py-1.5 bg-surface-700 hover:bg-green-500/20 hover:text-green-400 text-slate-300 rounded transition-colors border border-surface-600 shadow-sm">Accept</button>
                        <button onClick={() => handleRsvp(m.id, 'declined')} className="text-xs font-semibold px-3 py-1.5 bg-surface-700 hover:bg-red-500/20 hover:text-red-400 text-slate-300 rounded transition-colors border border-surface-600 shadow-sm">Decline</button>
                      </>
                    )}
                    
                    {meetingState[m.id] !== 'declined' && m.type === 'video' && (
                      <button className="text-xs font-bold px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors ml-auto flex items-center gap-1.5 shadow-sm shadow-blue-500/20">
                        <Video size={12} /> Join Call
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="card p-6">
             <h3 className="text-white font-bold mb-4">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric'})}</h3>
             <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
               {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="text-slate-500 font-medium py-1">{d}</div>)}
             </div>
             <div className="grid grid-cols-7 gap-1 text-center text-sm">
               {Array.from({length: 31}).map((_, i) => {
                 const day = i + 1;
                 const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth();
                 const isSelected = day === currentDate.getDate();
                 return (
                   <div key={i} onClick={() => { const d = new Date(currentDate); d.setDate(day); setCurrentDate(d); }} className={`py-1.5 rounded-full cursor-pointer transition-colors ${isSelected ? 'bg-primary-500 text-white font-bold' : isToday ? 'bg-surface-600 text-white font-bold' : 'text-slate-300 hover:bg-surface-700'}`}>
                     {day}
                   </div>
                 )
               })}
             </div>
          </div>
          
          <div className="card p-5 border-dashed border-surface-600 border-2 bg-transparent">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Clock size={14} className="text-yellow-400" /> Pending Invites</h4>
            <div className="text-xs text-slate-400 mb-4 leading-relaxed bg-surface-900 border border-surface-600 p-3 rounded-lg">
              <strong className="text-slate-200">System Architecture Review</strong><br />
              Requested by Systems Team
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 py-1.5 rounded transition-colors text-xs font-bold">Accept</button>
              <button className="flex-1 bg-surface-800 text-slate-400 hover:bg-surface-700 py-1.5 rounded transition-colors text-xs font-bold">Decline</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
