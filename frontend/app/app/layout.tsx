'use client';

import React from "react"

import { AppLayout } from '@/app/components/AppLayout';
import { useApp } from '@/lib/contexts/app-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AppRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Prevent rendering while redirecting
  }

  return <AppLayout>{children}</AppLayout>;
}
