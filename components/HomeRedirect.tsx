"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const hasVisitedHome = localStorage.getItem('has_visited_home');
    
    if (!hasVisitedHome) {
      localStorage.setItem('has_visited_home', 'true');
      router.replace('/about');
    }
  }, [router]);

  return <>{children}</>;
}

