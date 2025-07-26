'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';

interface AdminProtectionProps {
  children: React.ReactNode;
}

export default function AdminProtection({ children }: AdminProtectionProps) {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Don't redirect while loading
    if (loading) return;

    // If not authenticated or not admin, redirect to login
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login?redirect=/admin');
      return;
    }
  }, [isAuthenticated, user, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated or not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Render children if authenticated and admin
  return <>{children}</>;
}