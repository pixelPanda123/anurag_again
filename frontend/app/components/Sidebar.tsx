'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import {
  LayoutDashboard,
  History,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useApp } from '@/lib/contexts/app-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/app/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: 'History',
    href: '/app/history',
    icon: <History className="w-5 h-5" />,
  },
  {
    title: 'Settings',
    href: '/app/settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useApp();
  const [isOpenState, setIsOpenState] = useState(isOpen);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const handleNavClick = () => {
    if (onClose) {
      onClose();
    }
    setIsOpenState(false);
  };

  const sidebarClasses = cn(
    'fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col transition-transform md:relative md:translate-x-0 md:w-64',
    isOpenState ? 'translate-x-0' : '-translate-x-full'
  );

  return (
    <>
      {/* Overlay */}
      {isOpenState && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => {
            setIsOpenState(false);
            onClose?.();
          }}
          role="presentation"
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses} role="navigation" aria-label="Main navigation">
        {/* Close Button (Mobile) */}
        <div className="flex items-center justify-between p-4 md:hidden border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-bold text-lg text-slate-900 dark:text-slate-50">DocAccess</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsOpenState(false);
              onClose?.();
            }}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Logo (Desktop) */}
        <div className="hidden md:flex items-center p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-bold text-lg text-slate-900 dark:text-slate-50">DocAccess</h2>
        </div>

        {/* Navigation Items */}
        <ScrollArea className="flex-1">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href.split('?')[0]);
              return (
                <Link key={item.href} href={item.href} onClick={handleNavClick}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className="w-full justify-start gap-3"
                    size="sm"
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-transparent"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  );
}

interface SidebarTriggerProps {
  onClick?: () => void;
}

export function SidebarTrigger({ onClick }: SidebarTriggerProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="md:hidden"
      aria-label="Open sidebar"
    >
      <Menu className="w-5 h-5" />
    </Button>
  );
}
