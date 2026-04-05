import React, { useState } from 'react';
import { Search, Send, User, MessageSquare, Video, Phone, Mail, MoreVertical } from 'lucide-react';
import { CHAT_HISTORY } from '../data';

export default function ChatView({ currentUser, employees }) {
  const [threads, setThreads] = useState({
    'support': [
      { id: 1, sender: 'IT Support Team', time: '10:02 AM', message: 'Welcome to the team! We noticed your laptop was delivered successfully. Let us know if you need help connecting to the VPN.', self: false }
    ],
    'manager': [
      { id: 2, sender: 'Sarah Johnson (Manager)', time: 'Yesterday', message: 'Hey, looking forward to our 1:1 sync later. Let me know if you hit any roadblocks going through the onboarding checklist.', self: false }
    ]
  });
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeContactId, setActiveContactId] = useState('support');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !activeContactId) return;
    
    const newMsg = { id: Date.now(), sender: currentUser.name, time: 'Just now', message: input.trim(), self: true };
    setThreads(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMsg]
    }));
    setInput('');
  };

  const sysContacts = [
    { id: 'support', name: 'IT Support Team', role: 'Systems & Helpdesk', initials: 'IT', isOnline: true },
  ].filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredEmployees = employees
    .filter(emp => emp.id !== (currentUser.id || -1))
    .map(emp => ({ ...emp, initials: emp.name[0] + (emp.name.split(' ')[1]?.[0] || '') }))
    .concat(
      currentUser.type === 'employee' 
        ? [{ id: 'manager', name: 'Sarah Johnson', role: 'Manager', department: 'Management', status: 'Active', initials: 'SJ' }] 
        : []
    )
    .filter(emp => 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (emp.department || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="flex h-full w-full bg-surface-950 overflow-hidden text-sm">
      {/* Left Pane - Contacts List */}
      <div className="w-80 bg-surface-900 border-r border-surface-600 flex flex-col shrink-0">
        <div className="p-4 border-b border-surface-600">
          <h2 className="text-white font-bold text-lg mb-4">Chat</h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search people..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-800 text-white pl-10 pr-4 py-2 rounded-lg border border-surface-600 focus:border-primary-500 outline-none transition-colors focus:bg-surface-900"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {sysContacts.length > 0 && (
            <div className="mb-2">
              <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Teams & Support</div>
              {sysContacts.map(c => {
                const isActive = activeContactId === c.id;
                return (
                  <button 
                    key={c.id}
                    onClick={() => setActiveContactId(c.id)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-surface-800 transition-colors border-b border-surface-800/50 ${isActive ? 'bg-surface-800' : ''}`}
                  >
                    <div className="relative w-10 h-10 rounded-full bg-primary-900 border border-primary-500/30 flex items-center justify-center text-primary-300 font-bold shrink-0">
                      {c.initials}
                      {c.isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-surface-900 rounded-full" />}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-white font-medium truncate">{c.name}</div>
                      <div className="text-slate-500 text-xs truncate">{c.role}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {filteredEmployees.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Direct Messages</div>
              {filteredEmployees.map(emp => {
                const isActive = activeContactId === emp.id;
                const initials = emp.name[0] + (emp.name.split(' ')[1]?.[0] || '');
                return (
                  <button 
                    key={emp.id}
                    onClick={() => setActiveContactId(emp.id)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-surface-800 transition-colors border-b border-surface-800/50 ${isActive ? 'bg-surface-800' : ''}`}
                  >
                    <div className="relative w-10 h-10 rounded-full bg-surface-700 border border-surface-600 flex items-center justify-center text-slate-300 font-bold shrink-0">
                      {initials}
                      {emp.status === 'Active' && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-surface-900 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-white font-medium truncate">{emp.name}</div>
                      <div className="text-slate-500 text-xs truncate">{emp.role}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
          {sysContacts.length === 0 && filteredEmployees.length === 0 && (
            <div className="p-4 text-center text-slate-500">No contacts found</div>
          )}
        </div>
      </div>

      {/* Middle Pane - Active Thread */}
      <div className="flex-1 flex flex-col bg-surface-950 min-w-0 border-r border-surface-600">
        {(() => {
          const activeContact = sysContacts.find(c => c.id === activeContactId) || 
                                filteredEmployees.find(e => e.id === activeContactId) ||
                                employees.find(e => e.id === activeContactId); // fallback incase it's filtered out
          const activeMessages = threads[activeContactId] || [];

          return (
            <>
              {/* Chat Header */}
              <div className="h-14 border-b border-surface-600 bg-surface-900 flex items-center px-6 shrink-0 justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} className="text-primary-400" />
                  <h3 className="text-white font-semibold">{activeContact ? activeContact.name : 'Internal Communications'}</h3>
                </div>
                {activeContact && (
                  <div className="flex items-center gap-3">
                    <button className="p-2 text-slate-400 hover:text-primary-400 hover:bg-surface-800 rounded-lg transition-colors" title="Start Video Call">
                      <Video size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-primary-400 hover:bg-surface-800 rounded-lg transition-colors" title="Start Audio Call">
                      <Phone size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
                {activeMessages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-slate-500">
                    No messages yet. Send a message to start the conversation!
                  </div>
                ) : (
                  activeMessages.map(msg => {
                    const isSelf = msg.self;
                    return (
                      <div key={msg.id} className={`flex gap-3 max-w-[75%] lg:max-w-[60%] ${isSelf ? 'ml-auto flex-row-reverse' : ''}`}>
                        <div className="w-8 h-8 rounded-full bg-surface-700 border border-surface-600 flex items-center justify-center shrink-0">
                          {isSelf ? <User size={14} className="text-primary-400" /> : <User size={14} className="text-slate-400" />}
                        </div>
                        <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-slate-300 text-xs font-semibold">{isSelf ? 'You' : msg.sender}</span>
                            <span className="text-slate-500 text-[10px]">{msg.time}</span>
                          </div>
                          <div className={`px-4 py-3 text-[13px] leading-relaxed ${
                            isSelf 
                              ? 'bg-primary-600 text-white rounded-2xl rounded-tr-sm' 
                              : 'bg-surface-800 text-slate-200 border border-surface-700 rounded-2xl rounded-tl-sm'
                          }`}>
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          );
        })()}

        {/* Input area */}
        <div className="p-4 border-t border-surface-600 bg-surface-900 border-t-solid">
          <form onSubmit={handleSend} className="relative flex items-center max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-surface-800 text-white pr-12 pl-4 py-3 placeholder:text-slate-500 outline-none text-sm transition-colors focus:bg-surface-700 rounded-xl border border-surface-600 focus:border-primary-500 shadow-sm"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 p-1.5 bg-primary-500 hover:bg-primary-600 disabled:bg-surface-700 disabled:text-slate-500 text-white rounded-lg transition-colors shadow"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
