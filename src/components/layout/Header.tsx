import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
}

export default function Header({ isLoggedIn = false, userName = '' }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Get avatar and display name from user_metadata if available
  const avatarUrl = user?.user_metadata?.avatar_url || '';
  const displayName = user?.user_metadata?.name || user?.email || userName || '';
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '';

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-indigo-600">CodeAnalyzer</span>
              </Link>
            </div>
            {/* <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/"
                className={`${pathname === '/' 
                  ? 'border-indigo-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} 
                  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Home
              </Link>
              <Link 
                href="/features"
                className={`${pathname === '/features' 
                  ? 'border-indigo-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} 
                  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Features
              </Link>
              <Link 
                href="/pricing"
                className={`${pathname === '/pricing' 
                  ? 'border-indigo-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} 
                  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Pricing
              </Link>
            </nav> */}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoggedIn ? (
  <div className="flex items-center space-x-6">
    <Link 
      href="/dashboard"
      className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
    >
      Dashboard
    </Link>
    <div className="relative group flex items-center">
      <button className="flex items-center space-x-3 focus:outline-none group">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName + " avatar"}
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-lg"
            referrerPolicy="no-referrer"
            priority
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold shadow-lg border-2 border-white">
            {initial || (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            )}
          </div>
        )}
        <span className="text-base font-medium text-gray-700 dark:text-gray-200 hidden sm:inline-block">
          {displayName}
        </span>
        <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus:pointer-events-auto transition-all z-50">
        <button
  type="button"
  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 transition-colors"
  onClick={() => router.push('/dashboard/profile')}
>
  Profile
</button>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/login"
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Log in
                </Link>
                <Link 
                  href="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open main menu</span>
              {/* Mobile menu button */}
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
