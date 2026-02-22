import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Define Navigation based on roles
  const navigation = [
    { name: 'Dashboard', path: `/${user.role.toLowerCase()}/dashboard`, roles: ['Admin', 'Instructor', 'Registrar'], icon: 'grid' },
    { name: 'Settings', path: '/settings', roles: [ 'Admin', 'Instructor', 'Registrar'], icon: 'settings' },
    { name: 'Courses', path: '/registrar/courses', roles: ['Admin', 'Registrar'], icon: 'users' },
  ];

  const filteredNav = navigation.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 transition-all duration-300 flex flex-col border-r border-slate-800`}>
        <div className="p-6 flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex-shrink-0" />
          {isSidebarOpen && <span className="text-white font-bold text-xl tracking-tight">ServeTrack</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {filteredNav.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="w-5 h-5 bg-current opacity-20 rounded" /> {/* Placeholder for Icons */}
              {isSidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-3 px-3 py-2 w-full text-slate-400 hover:text-red-400 transition-colors"
          >
            <div className="w-5 h-5 border-2 border-current rounded-full" />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-slate-500 hover:text-slate-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">{user.email}</p>
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">{user.role}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
               <img src={`https://ui-avatars.com/api/?name=${user.role}&background=random`} alt="avatar" />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;