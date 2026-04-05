import React, { useState, useEffect } from 'react';
import { IconSend, IconLayoutGrid, IconSparkles } from '@tabler/icons-react';
import { useAuth } from '../context/AuthContext.tsx';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const HomePage = () => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [existingCourse, setExistingCourse] = useState<{id: string, title: string, description: string, modules: {id: string, title: string}[]} | null>(null);
  const { isAuthenticated, token, user, apiFetch } = useAuth();
  const location = useLocation();

  // Polling for course status
  useEffect(() => {
    let intervalId: number;

    if (jobId && isAuthenticated) {
      intervalId = window.setInterval(async () => {
        try {
          const response = await apiFetch(`http://localhost:8080/api/courses/status/${jobId}`);

          if (response.ok) {
            const data = await response.json();
            if (data.status === 'COMPLETED' && data.course) {
              setExistingCourse(data.course);
              setJobId(null);
              clearInterval(intervalId);
              // Dispatch event to refresh sidebar and ensure it stays there
              window.dispatchEvent(new CustomEvent('courseAccessed', { detail: data.course.title }));
            } else if (data.status === 'FAILED') {
              alert(`Course generation failed: ${data.error || 'Unknown error'}`);
              setJobId(null);
              clearInterval(intervalId);
            }
          }
        } catch (error) {
          console.error('Error polling status:', error);
          if (error instanceof Error && error.message === 'Session expired') {
            clearInterval(intervalId);
          }
        }
      }, 3000); // Poll every 3 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [jobId, isAuthenticated]);

  const handleSubmit = async (e?: React.FormEvent, manualTopic?: string) => {
    if (e) e.preventDefault();
    const topic = manualTopic || inputValue;
    if (!topic.trim() || !isAuthenticated) return;

    setLoading(true);
    setJobId(null);
    setExistingCourse(null);
    
    try {
      const response = await apiFetch('http://localhost:8080/api/courses/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: topic }),
      });

      const data = await response.json();

      if (response.status === 202) {
        setExistingCourse(data);
        setInputValue("");
        // Dispatch event to refresh sidebar with existing course title
        window.dispatchEvent(new CustomEvent('courseAccessed', { detail: data.title }));
      } else if (response.status === 200) {
        setJobId(data.jobId);
        setInputValue("");
        // Dispatch event to refresh sidebar with new topic title
        window.dispatchEvent(new CustomEvent('courseAccessed', { detail: topic }));
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error calling generate API:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle click from Recent sidebar
  useEffect(() => {
    if (location.state?.searchTopic) {
      setInputValue(location.state.searchTopic);
      handleSubmit(undefined, location.state.searchTopic);
      // Clear state so it doesn't re-trigger
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const LoadingShimmer = () => (
    <div className="w-full max-w-4xl space-y-8 animate-pulse">
      <div className="text-center space-y-4">
        <div className="h-12 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded-2xl mx-auto" />
        <div className="h-6 w-1/2 bg-neutral-200 dark:bg-neutral-800 rounded-xl mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-[2.5rem] border border-neutral-300 dark:border-neutral-700" />
        ))}
      </div>
      <div className="flex flex-col items-center gap-2 pt-8">
        <IconSparkles className="text-blue-500 animate-bounce" size={32} />
        <p className="text-neutral-500 dark:text-neutral-400 font-medium text-lg animate-pulse">
          Crafting your personalized learning path...
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-between h-full bg-white dark:bg-neutral-900 transition-colors duration-200 overflow-hidden">
      {/* Scrollable Content Area */}
      <div className="flex-1 w-full overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-full">
          <AnimatePresence mode="wait">
            {jobId ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex justify-center"
              >
                <LoadingShimmer />
              </motion.div>
            ) : !existingCourse ? (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center w-full"
              >
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
                  Hello {isAuthenticated ? user?.name : "User"},
                </h1>
                <p className="text-2xl md:text-3xl font-medium text-neutral-500 dark:text-neutral-400 tracking-tight">
                  What do you wanna Learn Today?
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="course"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full"
              >
                <div className="text-center mb-16">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-widest mb-6">
                    Ready to Start
                  </span>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-6 leading-tight tracking-tight">
                    {existingCourse.title}
                  </h1>
                  <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                    {existingCourse.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {existingCourse.modules.map((module, idx) => (
                    <Link 
                      key={module.id} 
                      to={`/modules/${module.id}`}
                      className="flex items-center gap-5 p-8 bg-neutral-50 dark:bg-neutral-800/40 rounded-[2.5rem] border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 hover:bg-white dark:hover:bg-neutral-800 transition-all group shadow-sm"
                    >
                      <div className="h-14 w-14 rounded-2xl bg-white dark:bg-neutral-900 flex items-center justify-center shadow-xl border border-neutral-100 dark:border-neutral-800 group-hover:scale-110 group-hover:text-blue-600 transition-all">
                        <IconLayoutGrid size={28} />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-bold text-xs text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-1">Module {idx + 1}</h3>
                        <p className="text-xl font-bold text-neutral-800 dark:text-neutral-200 leading-tight">
                          {module.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Fixed Chat Input Section */}
      <div className="w-full max-w-3xl px-6 pb-10 pt-4 bg-gradient-to-t from-white dark:from-neutral-900 via-white/80 dark:via-neutral-900/80 to-transparent backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="relative group">
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800/80 rounded-[2rem] p-2 pl-8 shadow-2xl border border-transparent focus-within:border-blue-500/50 transition-all duration-300">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading || !!jobId}
              placeholder={loading || jobId ? "Analyzing library..." : "Explore another topic..."}
              className="flex-1 bg-transparent border-none outline-none py-4 text-neutral-800 dark:text-neutral-200 placeholder-neutral-500 text-lg"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim() || loading || !!jobId || !isAuthenticated}
              className={`p-3 rounded-full transition-all duration-300 mr-2 ${
                inputValue.trim() && !loading && !jobId && isAuthenticated
                ? "bg-blue-600 text-white shadow-xl hover:bg-blue-700 hover:scale-105 active:scale-95" 
                : "text-neutral-400 cursor-not-allowed"
              }`}
            >
              {loading || jobId ? (
                <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <IconSend size={24} />
              )}
            </button>
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
