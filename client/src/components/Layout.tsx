import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarBody, SidebarLink, SidebarProvider, useSidebar } from './Sidebar.tsx';
import { DownloadComponent } from './DownloadComponent.tsx';
import { SaveCourse } from './SaveCourse.tsx';
import Switch from './ui/Switch.tsx';
import { motion } from 'motion/react';
import { 
  Navbar, 
  NavBody, 
  NavbarLogo, 
  MobileNav,
  MobileNavHeader
} from './ui/Navbar.tsx';
import { 
  IconMessageCircle,
  IconBookmark,
  IconMenu2,
  IconLogout
} from "@tabler/icons-react";
import { cn } from "../utils/utils.ts";
import { useAuth } from '../context/AuthContext.tsx';

export const Layout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSavedCourseClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login');
    }
  };

  const links = [
    {
      label: "New chat",
      href: "/",
      icon: (
        <IconMessageCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Saved Course",
      href: "/saved-courses", // Changed from # to a dummy path for now
      onClick: handleSavedCourseClick,
      icon: (
        <IconBookmark className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const navContent : string = "What do you wanna Learn Today?"

  const [open, setOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage or system preference
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
        "rounded-md flex flex-col md:flex-row bg-neutral-400 dark:bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen" 
      )}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link as any} onClick={link.onClick} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t border-neutral-200 dark:border-neutral-700 pt-4">
            {isAuthenticated ? (
              <>
                <SidebarLink
                  link={{
                    label: user?.name || "User",
                    href: "#",
                    icon: (
                      <img
                        src={user?.picture || "https://assets.aceternity.com/manu.png"}
                        className="h-6 w-6 flex-shrink-0 rounded-full object-cover"
                        width={24}
                        height={24}
                        alt="Avatar"
                      />
                    ),
                  }}
                />
                <button 
                  onClick={logout}
                  className="flex items-center justify-start gap-2 group/sidebar py-2 px-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-700 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-400 transition duration-150 w-full text-left"
                >
                  <div className="flex-shrink-0 w-6 flex justify-center items-center">
                    <IconLogout className="h-5 w-5 flex-shrink-0" />
                  </div>
                  <motion.span
                    animate={{
                      width: open ? "auto" : 0,
                      opacity: open ? 1 : 0,
                    }}
                    className="text-sm whitespace-pre overflow-hidden"
                  >
                    Logout
                  </motion.span>
                </button>
              </>
            ) : (
              <SidebarLink
                link={{
                  label: "Login",
                  href: "/login",
                  icon: (
                    <div className="h-7 w-7 flex items-center justify-center bg-neutral-200 dark:bg-neutral-700 rounded-full">
                       <IconLogout className="h-4 w-4 rotate-180" />
                    </div>
                  ),
                }}
              />
            )}
          </div>
        </SidebarBody>
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar className="top-0 sticky">
            <NavBody>
              <div className="flex items-center gap-2">
                 <NavbarLogo />
              </div>
              <div className="flex-1 text-center font-semibold text-neutral-800 dark:text-neutral-200 truncate px-4">
                { navContent }
              </div>
              <div className="flex items-center justify-end gap-3">
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
          <main className="flex-1 overflow-y-auto">
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
      className="md:hidden text-neutral-800 dark:text-neutral-200 cursor-pointer" 
      onClick={() => setOpen(!open)} 
    />
  );
};

const Logo = () => {
  return (
    <div className="mt-2 dark:text-white flex justify-between items-center w-full px-2">
      <div className="flex-shrink-0 w-6 flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </div>
      <div className="pr-9 md:pr-0">
       <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
         <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
       </svg>
      </div>
    </div> 
  );
};

const LogoIcon = () => {
  return (
    <div className="mt-2 dark:text-white flex-shrink-0 w-full px-2 flex justify-start items-center">
      <div className="w-6 flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg> 
      </div>
    </div>
  );
};
