import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import pnpLogo from '../assets/img/pnp-logo.png';

const InstructorLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false); // New state for dropdown
  const dropdownRef = useRef(null); // Ref to handle clicking outside the menu

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigation = [
    {
      name: 'Dashboard',
      path: `/${user?.role?.toLowerCase() || 'unauthorized'}/dashboard`,
      roles: ['admin', 'instructor', 'registrar'],
      icon: 'grid'
    },
    { name: 'Courses', path: '/instructor/courses', roles: ['instructor'], icon: 'book' },
    { name: 'Settings', path: '/settings', roles: ['admin', 'instructor', 'registrar'], icon: 'settings' },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  const filteredNav = user?.role
    ? navigation.filter(item => item.roles.includes(user.role.toLowerCase()))
    : [];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 transition-all duration-300 flex flex-col border-r border-slate-800 z-20`}>
        {/* Header Section with Logo */}
        <div className="p-6 flex items-center gap-3">
          <img
            src={pnpLogo}
            alt="ServeTrack Logo"
            className="h-10 w-10 object-contain flex-shrink-0"
          />
          {isSidebarOpen && (
            <span className="text-white font-bold text-xl tracking-tight">
              ServeTrack
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {filteredNav.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${location.pathname === item.path
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {item.icon ? <item.icon size={20} /> : <div className="w-4 h-4 bg-current opacity-20 rounded" />}
              </div>
              {isSidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-slate-500 hover:text-slate-800 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>

          {/* User Profile & Dropdown Menu */}
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <div className="text-right">
              {/* Updated to use first_name and last_name */}
              <p className="text-sm font-bold text-slate-900">
                {user?.firstname || user?.lastname
                  ? `${user.firstname || ''} ${user.lastname || ''}`.trim()
                  : 'Guest'}
              </p>
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                {user?.role || 'No Role'}
              </p>
            </div>

            {/* Clickable Avatar Button */}
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="h-10 w-10 rounded-full bg-slate-200 border-2 border-transparent hover:border-blue-500 focus:border-blue-500 overflow-hidden transition-all outline-none"
            >
              {/* Updated avatar to generate initials based on the user's actual name */}
              <img
                src={`https://ui-avatars.com/api/?name=${user?.firstname ? `${user.firstname}+${user.lastname || ''}` : 'Guest'
                  }&background=random`}
                alt="avatar"
              />
            </button>

            {/* The Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-50 mb-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>
        {/* PAGE CONTENT */}
        <main className="p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout;