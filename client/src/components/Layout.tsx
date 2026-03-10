import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, SidebarBody, SidebarLink } from './Sidebar.tsx';
import Switch from './ui/Switch.tsx';
import { 
  Navbar, 
  NavBody, 
  NavItems, 
  NavbarLogo, 
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu
} from './ui/Navbar.tsx';
import { 
  IconMessageCircle,
  IconBookmark,
  IconUserBolt 
} from "@tabler/icons-react";
import { cn } from "../utils/utils.ts";

export const Layout = () => {
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
      href: "#",
      icon: (
        <IconBookmark className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const navItems = [
    { name: "Features", link: "#" },
    { name: "Pricing", link: "#" },
    { name: "About", link: "#" },
  ];

  const [open, setOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={cn(
      "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
      "h-screen" 
    )}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Abhishek",
                href: "#",
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar className="top-0 sticky">
          <NavBody>
            <NavbarLogo />
            <NavItems items={navItems} />
            <div className="flex items-center">
              <Switch checked={isDarkMode} onChange={setIsDarkMode} />
            </div>
          </NavBody>
          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              <div className="flex items-center gap-4">
                <Switch checked={isDarkMode} onChange={setIsDarkMode} />
                <MobileNavToggle 
                  isOpen={mobileNavOpen} 
                  onClick={() => setMobileNavOpen(!mobileNavOpen)} 
                />
              </div>
            </MobileNavHeader>
            <MobileNavMenu isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)}>
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <a key={item.name} href={item.link} className="text-neutral-600 dark:text-neutral-300">
                    {item.name}
                  </a>
                ))}
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="mt-2 dark:text-white flex justify-between">
      <div>
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
    <div className="mt-2 dark:text-white">
       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
         <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
       </svg> 
    </div>
  );
};
