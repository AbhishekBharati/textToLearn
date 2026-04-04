import React, { useState } from 'react';
import { IconSend } from '@tabler/icons-react';
import { useAuth } from '../context/AuthContext.tsx';

export const HomePage = () => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [existingCourse, setExistingCourse] = useState<{title: string, modules: string[]} | null>(null);
  const { isAuthenticated, token, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !isAuthenticated || !token) return;

    setLoading(true);
    setJobId(null);
    setExistingCourse(null);
    
    try {
      const response = await fetch('http://localhost:8080/api/courses/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: inputValue }),
      });

      const data = await response.json();

      if (response.status === 202) {
        // Course already exists
        console.log('Course exists:', data);
        setExistingCourse({ title: data.title, modules: data.modules });
        setInputValue("");
      } else if (response.status === 200) {
        // New generation started
        console.log('Generation started:', data);
        setJobId(data.jobId);
        setInputValue("");
      } else {
        console.error('Failed to process request:', data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error calling generate API:', error);
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
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
        
        {/* Success / Status Messages */}
        {jobId && (
          <div className="mt-8 p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-2xl border border-blue-200 dark:border-blue-800 animate-in fade-in slide-in-from-bottom-4">
            Course generation started! Job ID: <span className="font-mono font-bold">{jobId}</span>
          </div>
        )}

        {existingCourse && (
          <div className="mt-8 p-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-2xl border border-green-200 dark:border-green-800 animate-in fade-in slide-in-from-bottom-4 w-full max-w-md">
            <h2 className="text-xl font-bold mb-2 text-green-800 dark:text-green-300">Course Available!</h2>
            <p className="font-medium mb-2">"{existingCourse.title}" is already in our library.</p>
            <div className="text-sm opacity-80">
              <p className="font-bold mb-1">Modules:</p>
              <ul className="list-disc list-inside">
                {existingCourse.modules.slice(0, 3).map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
                {existingCourse.modules.length > 3 && <li>...and {existingCourse.modules.length - 3} more</li>}
              </ul>
            </div>
          </div>
        )}
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
              disabled={loading}
              placeholder={loading ? "Checking..." : "Enter a topic or ask a question..."}
              className="flex-1 bg-transparent border-none outline-none py-3 text-neutral-800 dark:text-neutral-200 placeholder-neutral-500 text-lg"
            />
            
            <div className="flex items-center gap-1 md:gap-2 mr-2">
              <button 
                type="submit"
                disabled={!inputValue.trim() || loading || !isAuthenticated}
                className={`p-2 rounded-full transition-all duration-200 ${
                  inputValue.trim() && !loading && isAuthenticated
                  ? "bg-blue-600 text-white shadow-md hover:bg-blue-700" 
                  : "text-neutral-400 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <IconSend size={22} />
                )}
              </button>
            </div>
          </div>
        </form>
        
        {!isAuthenticated && (
          <p className="text-xs text-center text-red-500 mt-4 font-medium">
            Please login to generate courses.
          </p>
        )}
        
        <p className="text-xs text-center text-neutral-400 dark:text-neutral-500 mt-4">
          TechEaze can provide detailed explanations and learning paths. Enjoy your learning.
        </p>
      </div>
    </div>
  );
};
