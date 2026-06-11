import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send } from 'lucide-react';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden border border-brand-100 flex flex-col"
          >
            <div className="bg-brand-900 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold font-display">Kroma Support</h3>
                <p className="text-xs text-brand-200">Typically replies in a few minutes</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-brand-800 rounded transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="h-64 bg-brand-50 p-4 flex flex-col gap-3 overflow-y-auto">
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm max-w-[85%] border border-gray-100">
                  Hi there! 👋 Welcome to Kroma. How can we help you elevate your brand today?
                </div>
              </div>
            </div>

            <div className="p-3 bg-white border-t border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      // Stub sending logic
                      setMessage('');
                    }
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-3 pr-12 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                />
                <button 
                  onClick={() => setMessage('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group float-right mt-4">
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-200" />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center shadow-2xl text-white transform hover:scale-105 active:scale-95 transition-transform"
          aria-label="Open chat"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <MessageSquare size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
        {/* Pulse Effect */}
        {!isOpen && (
          <div className="absolute top-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse" />
        )}
      </div>
    </div>
  );
}
