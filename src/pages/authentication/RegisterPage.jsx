import React, { useState } from 'react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Instructor'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registering account:", formData);
    // Integration point for your ML Backend Auth API
  };

  return (
    <div className="min-h-screen antialiased text-slate-900 relative overflow-hidden">
      {/* Shared Background Hero Section */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(2,6,23,.92) 0%, rgba(2,6,23,.62) 46%, rgba(2,6,23,.30) 100%),
            radial-gradient(1200px 600px at 15% 30%, rgba(59,130,246,.25), transparent 60%),
            radial-gradient(900px 500px at 80% 20%, rgba(16,185,129,.18), transparent 55%),
            url('/img/police-bg.jpg')` 
        }}
      />

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full max-w-7xl mx-auto px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/10 ring-1 ring-white/20 flex items-center justify-center overflow-hidden">
              <img src="/img/pnp-logo.png" className="h-full w-full object-cover" alt="ServeTrack Logo" />
            </div>
            <div className="leading-tight">
              <div className="text-white font-extrabold text-xl tracking-tight">ServeTrack</div>
              <div className="text-white/70 text-xs -mt-0.5">Student Success Platform</div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 py-10 lg:py-14 w-full">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Side: Information */}
              <section className="lg:col-span-7 xl:col-span-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-4 py-2 text-white/90 text-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  Join the Platform
                </div>

                <h1 className="mt-6 text-white font-extrabold tracking-tight text-4xl sm:text-5xl xl:text-6xl leading-tight">
                  Get Started with<br className="hidden sm:block"/>
                  ServeTrack
                </h1>

                <p className="mt-4 text-white/75 max-w-2xl text-base sm:text-lg leading-relaxed">
                  Register to access course management, student tracking, and performance insights — built for speed, clarity, and security.
                </p>

                <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-2xl">
                  <FeatureItem 
                    title="Account Approval" 
                    desc="New accounts require admin or registrar verification." 
                    icon={<path d="M12 3l7 4v6c0 5-3 9-7 9s-7-4-7-9V7l7-4z"/>} 
                  />
                  <FeatureItem 
                    title="Role-based Access" 
                    desc="Specific views for Instructors and Registrars." 
                    icon={<path d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm7 10a7 7 0 10-14 0h14z"/>} 
                  />
                </div>
              </section>

              {/* Right Side: Register Card */}
              <aside className="lg:col-span-5 xl:col-span-4">
                <div className="relative group">
                  {/* Glowing Border Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-[1.8rem] opacity-30 blur-sm group-hover:opacity-50 transition duration-1000"></div>
                  
                  <div className="relative bg-white/92 backdrop-blur-xl border border-white/45 rounded-[1.75rem] p-7 sm:p-8 shadow-2xl">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Register</h2>
                      <p className="mt-1 text-sm text-slate-600">Create your account to request access</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Email Input */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8l8 5 8-5M4 8v10a2 2 0 002 2h12a2 2 0 002-2V8M4 8l8-5 8 5"/>
                          </svg>
                        </span>
                        <input
                          type="email"
                          required
                          placeholder="Email Address"
                          className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>

                      {/* Password Input */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V8a4 4 0 10-8 0v3m-2 0h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a2 2 0 012-2z"/>
                          </svg>
                        </span>
                        <input
                          type="password"
                          required
                          minLength="6"
                          placeholder="Password"
                          className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 px-1 italic">Minimum 6 characters required.</p>

                      {/* Role Selection */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 12a5 5 0 100-10 5 5 0 000 10zm7 10a7 7 0 10-14 0h14z"/>
                          </svg>
                        </span>
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-11 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer"
                        >
                          <option value="Instructor">Instructor</option>
                          <option value="Registrar">Registrar</option>
                        </select>
                        <span className="absolute inset-y-0 right-3 flex items-center text-slate-400 pointer-events-none">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 9l6 6 6-6"/>
                          </svg>
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 px-1 italic">New accounts require manual approval before sign-in.</p>

                      <button
                        type="submit"
                        className="w-full mt-2 rounded-full py-3.5 font-semibold text-white shadow-lg bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        Create Account
                      </button>

                      <p className="text-center text-sm text-slate-600 pt-2">
                        Already have an account? <span className="font-semibold text-blue-600 hover:underline cursor-pointer">Login here</span>
                      </p>
                    </form>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>

        <footer className="pb-8 max-w-7xl mx-auto px-6 w-full text-white/50 text-xs">
          © 2026 ServeTrack. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

const FeatureItem = ({ title, desc, icon }) => (
  <div className="flex gap-3 rounded-2xl bg-white/5 ring-1 ring-white/10 px-4 py-4 backdrop-blur-sm">
    <div className="mt-0.5 h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center">
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {icon}
      </svg>
    </div>
    <div>
      <div className="text-white font-semibold">{title}</div>
      <div className="text-white/70 text-sm">{desc}</div>
    </div>
  </div>
);

export default RegisterPage;