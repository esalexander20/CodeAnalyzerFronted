import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '../auth/ProtectedRoute';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <div className="md:pl-64 flex flex-col flex-1">
          <Header isLoggedIn={!!user} userName={user?.user_metadata?.name || 'Guest'} />
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
