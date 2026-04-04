import { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { SidebarBody, SidebarLink, SidebarProvider, useSidebar } from './Sidebar.tsx';
import { DownloadComponent } from './DownloadComponent.tsx';
import { SaveCourse } from './SaveCourse.tsx';
import Switch from './ui/Switch.tsx';
import { motion } from 'motion/react';
import { 
  Navbar, 
  NavBody, 
  MobileNav,
  MobileNavHeader,
  NavbarLogo
} from './ui/Navbar.tsx';
import { 
  IconMessageCircle,
  IconBookmark,
  IconMenu2,
  IconLogout,
  IconHistory
} from "@tabler/icons-react";
import { cn } from "../utils/utils.ts";
import { useAuth } from '../context/AuthContext.tsx';

export const Layout = () => {
  const { isAuthenticated, user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [recentCourses, setRecentCourses] = useState<{id: string, title: string}[]>([]);

  const fetchRecent = async (event?: any) => {
    if (!isAuthenticated || !token) return;
    
    // Optimistically add the new topic if event detail is provided
    if (event && event.detail) {
      const topicTitle = event.detail;
      setRecentCourses(prev => {
        // Prevent duplicate titles
        if (prev.some(c => c.title === topicTitle)) return prev;
        
        // Add new topic at the beginning with a temporary ID
        const newCourse = { id: `temp-${Date.now()}`, title: topicTitle };
        return [newCourse, ...prev].slice(0, 10);
      });
      return; // Skip server fetch for the immediate event if we're optimistic
    }

    try {
      const response = await fetch('http://localhost:8080/api/courses/recent', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRecentCourses(data);
      }
    } catch (error) {
      console.error('Error fetching recent courses:', error);
    }
  };

  useEffect(() => {
    fetchRecent();
    window.addEventListener('courseAccessed', fetchRecent as EventListener);
    return () => window.removeEventListener('courseAccessed', fetchRecent as EventListener);
  }, [isAuthenticated, token]);

  const links = [
    {
      label: "New chat",
      href: "/",
      icon: (
        <IconMessageCircle size={20} className="text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Saved Course",
      href: "/saved-courses",
      icon: (
        <IconBookmark size={20} className="text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={true}>
      <div className={cn(
        "flex flex-col md:flex-row bg-white dark:bg-neutral-900 w-full flex-1 max-w-7xl mx-auto border-x border-neutral-200 dark:border-neutral-800 overflow-hidden",
        "h-screen" 
      )}>
        <SidebarBody className="justify-between gap-10 border-r border-neutral-200 dark:border-neutral-800 !p-0">
          <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar">
            {/* Standardized Header */}
            <div className="h-16 flex items-center px-4 mb-4">
               <div className="w-6 flex justify-center items-center">
                 <IconMenu2 
                   className="text-neutral-800 dark:text-neutral-200 cursor-pointer h-5 w-5" 
                   onClick={() => setOpen(!open)} 
                 />
               </div>
            </div>

            <div className="flex flex-col gap-2 px-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link as any} />
              ))}
            </div>

            {/* Recent Section */}
            <div className="mt-10 px-2">
              <div className="flex items-center gap-2 text-neutral-400 dark:text-neutral-500 mb-4 px-2">
                <div className="w-6 flex justify-center items-center">
                  <IconHistory size={18} />
                </div>
                {open && <span className="text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">Recent</span>}
              </div>
              
              <div className="flex flex-col gap-1">
                {recentCourses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => {
                      navigate('/', { state: { searchTopic: course.title } });
                    }}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors group w-full"
                  >
                    <div className="w-6 flex justify-center items-center flex-shrink-0">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500/40 group-hover:bg-blue-500 transition-colors" />
                    </div>
                    {open && (
                      <span className="text-sm text-neutral-600 dark:text-neutral-400 truncate flex-1 font-medium">
                        {course.title}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-neutral-200 dark:border-neutral-800 p-2 pb-4">
            {isAuthenticated ? (
              <>
                <SidebarLink
                  link={{
                    label: user?.name || "User",
                    href: "#",
                    icon: (
                      <img
                        src={user?.picture || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                        className="h-6 w-6 flex-shrink-0 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                        width={24}
                        height={24}
                        alt="Avatar"
                      />
                    ),
                  }}
                />
                <button 
                  onClick={logout}
                  className="flex items-center justify-start gap-2 group/sidebar py-2 px-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/10 text-neutral-700 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-400 transition duration-150 w-full text-left"
                >
                  <div className="w-6 flex justify-center items-center flex-shrink-0">
                    <IconLogout size={18} />
                  </div>
                  {open && <span className="text-sm font-bold">Logout</span>}
                </button>
              </>
            ) : (
              <SidebarLink
                link={{
                  label: "Login",
                  href: "/login",
                  icon: (
                    <div className="h-6 w-6 flex items-center justify-center bg-neutral-200 dark:bg-neutral-700 rounded-full">
                       <IconLogout size={14} className="rotate-180" />
                    </div>
                  ),
                }}
              />
            )}
          </div>
        </SidebarBody>

        <div className="flex flex-col flex-1 overflow-hidden bg-neutral-50 dark:bg-neutral-950">
          <Navbar className="top-0 sticky bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 h-16">
            <NavBody className="h-full border-none shadow-none bg-transparent">
              <div className="flex items-center gap-2">
                 <SidebarToggle />
                 <NavbarLogo />
              </div>
              <div className="flex-1" />
              <div className="flex items-center justify-end gap-3 px-4">
                <Switch checked={isDarkMode} onChange={setIsDarkMode} />
                <DownloadComponent />
                <SaveCourse />
              </div>
            </NavBody>
            <MobileNav>
              <MobileNavHeader>
                <div className="flex items-center gap-2">
                  <SidebarToggle />
                  <NavbarLogo />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={isDarkMode} onChange={setIsDarkMode} /> 
                  <DownloadComponent />
                  <SaveCourse />
                </div>
              </MobileNavHeader>
            </MobileNav>
          </Navbar>
          <main className="flex-1 overflow-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const SidebarToggle = () => {
  const { open, setOpen } = useSidebar();
  return (
    <IconMenu2 
      className="md:hidden text-neutral-800 dark:text-neutral-200 cursor-pointer h-6 w-6" 
      onClick={() => setOpen(!open)} 
    />
  );
};
