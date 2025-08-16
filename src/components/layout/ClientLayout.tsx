'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { PopupWidget } from '@/components/home/PopupWidget';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  
  return (
    <ErrorBoundary>
      <>
        {!isDashboard && <Navbar />}
        <div>{children}</div>
        {!isDashboard && <Footer />}
        {!isDashboard && <PopupWidget />}
      </>
    </ErrorBoundary>
  );
}
