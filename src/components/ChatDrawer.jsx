import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User } from 'lucide-react';
import { CHAT_HISTORY } from '../data';

export default function ChatDrawer({ isOpen, onClose, currentUser }) {
  const [messages, setMessages] = useState(CHAT_HISTORY);
  const [input, setInput] = useState('');

  // Close with Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [
      ...prev, 
      { id: Date.now(), sender: currentUser.name, time: 'Just now', message: input.trim(), self: true }
    ]);
    setInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-900 border-l border-surface-600 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="h-16 px-6 border-b border-surface-600 flex items-center justify-between shrink-0 bg-surface-800">
              <div>
                <h2 className="text-white font-semibold flex items-center gap-2">
                  Messages <span className="bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">1 New</span>
                </h2>
                <p className="text-slate-400 text-xs">Internal Platform Comms</p>
              </div>
              <button onClick={onClose} className="p-2 rounded hover:bg-surface-700 text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
              {messages.map(msg => {
                const isSelf = msg.self;
                return (
                  <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isSelf ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-surface-700 border border-surface-600 flex items-center justify-center shrink-0">
                      {isSelf ? <User size={14} className="text-primary-400" /> : <User size={14} className="text-slate-400" />}
                    </div>
                    <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-slate-300 text-xs font-semibold">{isSelf ? 'You' : msg.sender}</span>
                        <span className="text-slate-500 text-[10px]">{msg.time}</span>
                      </div>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                        isSelf 
                          ? 'bg-primary-600 text-white rounded-tr-sm' 
                          : 'bg-surface-800 text-slate-200 border border-surface-700 rounded-tl-sm'
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-surface-600 bg-surface-900 border-t-solid">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-surface-800 text-white pr-12 pl-4 py-3 placeholder:text-slate-500 outline-none text-sm transition-colors focus:bg-surface-700 rounded-xl border border-surface-600 focus:border-primary-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 p-1.5 bg-primary-500 hover:bg-primary-600 disabled:bg-surface-700 disabled:text-slate-500 text-white rounded-lg transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
