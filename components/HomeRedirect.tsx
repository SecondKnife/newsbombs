"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Check if user has visited home page before
    const hasVisitedHome = localStorage.getItem('has_visited_home');
    
    if (!hasVisitedHome) {
      // First time visiting home page - redirect to about
      localStorage.setItem('has_visited_home', 'true');
      router.replace('/about');
    }
  }, [router]);

  // Return children (home page content) if user has visited before
  // During redirect, this won't be visible anyway
  return <>{children}</>;
}

