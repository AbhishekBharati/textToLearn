import React, { useState } from 'react';
import { IconSend } from '@tabler/icons-react';
import { useAuth } from '../context/AuthContext.tsx';

export const HomePage = () => {
  const [inputValue, setInputValue] = useState("");
  const { isAuthenticated, user, logout } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Logic for sending request can go here
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-full bg-white dark:bg-neutral-900 transition-colors duration-200">
      {/* Welcome Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 w-full max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent text-center">
          Hello {isAuthenticated ? user?.name : "User"},
        </h1>
        <p className="text-2xl md:text-3xl font-medium text-neutral-500 dark:text-neutral-400 text-center">
          What do you wanna Learn Today?
        </p>
      </div>

      {/* Chat Input Section */}
      <div className="w-full max-w-3xl px-4 pb-8">
        <form 
          onSubmit={handleSubmit}
          className="relative group"
        >
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-3xl p-2 pl-6 shadow-sm border border-transparent focus-within:border-neutral-300 dark:focus-within:border-neutral-700 transition-all duration-200">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter a topic or ask a question..."
              className="flex-1 bg-transparent border-none outline-none py-3 text-neutral-800 dark:text-neutral-200 placeholder-neutral-500 text-lg"
            />
            
            <div className="flex items-center gap-1 md:gap-2 mr-2">
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className={`p-2 rounded-full transition-all duration-200 ${
                  inputValue.trim() 
                  ? "bg-blue-600 text-white shadow-md hover:bg-blue-700" 
                  : "text-neutral-400 cursor-not-allowed"
                }`}
              >
                <IconSend size={22} />
              </button>
            </div>
          </div>
        </form>
        
        <p className="text-xs text-center text-neutral-400 dark:text-neutral-500 mt-4">
          TechEaze can provide detailed explanations and learning paths. Enjoy your learning.
        </p>
      </div>
    </div>
  );
};
