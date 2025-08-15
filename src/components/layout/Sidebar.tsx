import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  
  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    { 
      name: 'Repositories', 
      href: '/dashboard/repositories', 
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
    },
    { 
      name: 'Reports', 
      href: '/dashboard/reports', 
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    },
    { 
      name: 'Profile', 
      href: '/dashboard/profile', 
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
  ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-white">CodeAnalyzer</span>
            </Link>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
                >
                  <svg
                    className={`${
                      isActive ? 'text-indigo-400' : 'text-gray-400 group-hover:text-gray-300'
                    } mr-3 flex-shrink-0 h-6 w-6`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex bg-gray-700 p-4">
          <div className="flex items-center w-full">
            <div>
              <div className="h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                U
              </div>
            </div>
            <div className="ml-3 flex-grow">
              <p className="text-sm font-medium text-white">User Name</p>
              <Link
                href="/logout"
                className="text-xs font-medium text-gray-300 hover:text-white transition-colors duration-200"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
