import React, { useState } from 'react';
import { Mail, Send, Edit, Search, Inbox, Star, ChevronLeft } from 'lucide-react';

export default function EmailView({ currentUser }) {
  const [composing, setComposing] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  
  const emails = [
    { id: 1, sender: 'HR Department', subject: 'Action Required: Q2 All Hands Meeting', body: 'Please RSVP for the upcoming all hands to ensure accurate catering. Attached is the preliminary deck.', time: '10:30 AM', unread: true },
    { id: 2, sender: 'Jira Updates', subject: 'Task ENG-1042 Assigned to You', body: 'You have been assigned to Setup local dev environment... Click to view in Jira.', time: '09:12 AM', unread: true },
    { id: 3, sender: 'Sarah Johnson', subject: 'Weekly 1:1 Agenda', body: 'Hi! Please double check the agenda document for our 1:1 later today. I want to discuss your ongoing tasks and what you need right now.', time: 'Yesterday', unread: false },
    { id: 4, sender: 'Engineering All', subject: 'Release Notes: v4.12.0', body: 'The new release has been deployed to production. Key changes include database migrations and the new email flow.', time: 'Tue', unread: false },
    { id: 5, sender: 'IT Security', subject: '[Notice] Update 1Password', body: 'A new enterprise policy requires you to update 1Password immediately.', time: 'Mon', unread: false },
  ];

  return (
    <div className="flex w-full h-full bg-surface-950 overflow-hidden text-sm">
      {/* Sidebar folders */}
      <div className="w-64 border-r border-surface-600 bg-surface-900 flex flex-col shrink-0">
        <div className="p-4 border-b border-surface-600">
          <button onClick={() => {setComposing(true); setSelectedEmail(null);}} className="btn-primary w-full py-2 flex items-center justify-center gap-2">
            <Edit size={16} /> New Message
          </button>
        </div>
        <div className="flex-1 p-2 space-y-1">
          <button onClick={() => {setComposing(false); setSelectedEmail(null);}} className="w-full text-left px-4 py-2 bg-primary-600/20 text-primary-400 font-medium rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-2"><Inbox size={16} /> Inbox</div>
            <span className="text-xs font-bold leading-none py-0.5 px-1.5 bg-primary-500 rounded text-white">2</span>
          </button>
          <button className="w-full text-left px-4 py-2 text-slate-400 hover:bg-surface-800 rounded-lg flex justify-between items-center transition-colors">
            <div className="flex items-center gap-2"><Send size={16} /> Sent Items</div>
          </button>
          <button className="w-full text-left px-4 py-2 text-slate-400 hover:bg-surface-800 rounded-lg flex justify-between items-center transition-colors">
            <div className="flex items-center gap-2"><Star size={16} /> Starred</div>
          </button>
        </div>
      </div>

      {/* Inbox List */}
      {(!selectedEmail && !composing) && (
        <div className="flex-1 flex flex-col bg-surface-950 min-w-0 border-r border-surface-600">
          <div className="h-16 border-b border-surface-600 px-6 flex items-center shrink-0">
            <h2 className="text-white font-bold text-lg flex-1">Inbox</h2>
            <div className="relative w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" placeholder="Search mail" className="w-full bg-surface-800 text-white pl-10 pr-4 py-1.5 rounded-lg border border-surface-600 focus:border-primary-500 outline-none text-sm" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {emails.map(email => (
              <div key={email.id} onClick={() => setSelectedEmail(email)} className={`px-6 py-4 border-b border-surface-800 hover:bg-surface-800 transition-colors cursor-pointer group flex items-start gap-4 ${email.unread ? 'bg-surface-800/30' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs text-white ${email.unread ? 'bg-blue-600' : 'bg-surface-600'}`}>
                  {email.sender[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`text-sm truncate ${email.unread ? 'text-white font-bold' : 'text-slate-300 font-medium'}`}>{email.sender}</span>
                    <span className={`text-[11px] shrink-0 ml-2 ${email.unread ? 'text-blue-400' : 'text-slate-500'}`}>{email.time}</span>
                  </div>
                  <div className={`text-xs truncate mb-1 ${email.unread ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>{email.subject}</div>
                  <div className="text-[12px] text-slate-500 truncate">{email.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Read View */}
      {selectedEmail && !composing && (
        <div className="flex-1 flex flex-col bg-surface-900 border-r border-surface-600">
          <div className="h-14 border-b border-surface-600 px-4 flex items-center shrink-0">
            <button onClick={() => setSelectedEmail(null)} className="p-1.5 text-slate-400 hover:text-white hover:bg-surface-800 rounded mr-2 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div className="flex-1 font-semibold text-white truncate">{selectedEmail.subject}</div>
          </div>
          <div className="p-8 flex-1 overflow-y-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-surface-700 flex items-center justify-center text-lg font-bold text-white shrink-0">
                {selectedEmail.sender[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-white font-bold text-base">{selectedEmail.sender}</h3>
                  <span className="text-xs text-slate-500">{selectedEmail.time}</span>
                </div>
                <p className="text-slate-400 text-xs">To: {currentUser ? currentUser.email : 'you@acme.com'}</p>
              </div>
            </div>
            <div className="text-slate-300 leading-relaxed max-w-3xl">
              {selectedEmail.body}
            </div>
          </div>
        </div>
      )}

      {/* Compose View */}
      {composing && (
        <div className="flex-1 flex flex-col bg-surface-900 border-r border-surface-600">
          <div className="h-14 border-b border-surface-600 px-4 flex items-center shrink-0 justify-between">
            <div className="flex items-center">
              <button onClick={() => setComposing(false)} className="p-1.5 text-slate-400 hover:text-white hover:bg-surface-800 rounded mr-2 transition-colors">
                <ChevronLeft size={18} />
              </button>
              <div className="font-semibold text-white">New Message</div>
            </div>
            <button onClick={() => setComposing(false)} className="btn-primary py-1.5 px-4 text-xs flex items-center gap-2">
              <Send size={14} /> Send
            </button>
          </div>
          <div className="flex flex-col flex-1 p-6 max-w-4xl w-full mx-auto">
            <input type="text" placeholder="To" className="w-full bg-transparent border-b border-surface-600 text-white py-3 outline-none mb-4 text-sm focus:border-primary-500 transition-colors" autoFocus />
            <input type="text" placeholder="Subject" className="w-full bg-transparent border-b border-surface-600 text-white py-3 outline-none mb-6 text-sm focus:border-primary-500 transition-colors" />
            <textarea placeholder="Write your message here..." className="w-full flex-1 bg-transparent text-slate-300 outline-none resize-none text-sm mt-4" />
          </div>
        </div>
      )}
    </div>
  );
}
