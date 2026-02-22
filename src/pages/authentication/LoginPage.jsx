import React, { useState } from 'react';
// 1. Import your assets here
import pnpLogo from '../../assets/img/left-logo.png';
import policeBg from '../../assets/img/police-bg.jpg';
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router
import axios from 'axios'; // Import Axios
import toast, { Toaster } from 'react-hot-toast'; // Import Toast

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '', remember: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/auth/login', formData);

      // Log this to your console to see EXACTLY what the backend sends
      console.log("Backend Response:", response.data);

      // Updated destructuring based on your FastAPI return
      const { access_token, role, user_id, status } = response.data;

      // 1. Status Check
      // if (status?.toLowerCase() !== 'approved') {
      //   toast.error("Account pending approval.");
      //   setLoading(false);
      //   return;
      // }

      // 2. Store Data
      localStorage.setItem('token', access_token);
      localStorage.setItem('user',  JSON.stringify(response));

      toast.success(`Welcome back, ${role}!`);

      // 3. Navigation (Wait a tiny bit so they see the success toast)
      setTimeout(() => {
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'instructor') navigate('/instructor/dashboard');
        else if (role === 'registrar') navigate('/registrar/dashboard');
        else toast.error("Role not recognized");
      }, 1000);

    } catch (err) {
      console.error(err);
      const message = err.response?.data?.detail || "Connection failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen antialiased text-slate-900 relative overflow-hidden">
      <Toaster />
      {/* Background Hero Section */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          // 2. Use the imported variable for the background
          backgroundImage: `
            linear-gradient(90deg, rgba(2,6,23,.92) 0%, rgba(2,6,23,.62) 46%, rgba(2,6,23,.30) 100%),
            radial-gradient(1200px 600px at 15% 30%, rgba(59,130,246,.25), transparent 60%),
            radial-gradient(900px 500px at 80% 20%, rgba(16,185,129,.18), transparent 55%),
            url(${policeBg})`
        }}
      />

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full max-w-7xl mx-auto px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/10 ring-1 ring-white/20 flex items-center justify-center overflow-hidden">
              {/* 3. Use the imported variable for the logo */}
              <img src={pnpLogo} className="h-full w-full object-cover" alt="PNP Logo" />
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

              {/* Left Side: Marketing/Info */}
              <section className="lg:col-span-7 xl:col-span-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-4 py-2 text-white/90 text-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Predictive Analytics Active
                </div>

                <h1 className="mt-6 text-white font-extrabold tracking-tight text-4xl sm:text-5xl xl:text-6xl leading-tight">
                  Manage Courses, Sections,<br className="hidden sm:block" />
                  Students, and Grades
                </h1>

                <p className="mt-4 text-white/75 max-w-2xl text-base sm:text-lg leading-relaxed">
                  Leveraging Machine Learning to spot at-risk learners early and boost outcomes.
                </p>

                <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-2xl">
                  <FeatureItem
                    title="Ranked Confidence"
                    desc="Per-student predictions with risk scoring."
                    icon={<path d="M9 12h6M9 16h6M8 6h8a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />}
                  />
                  <FeatureItem
                    title="Secure Access"
                    desc="Lightweight Authentication using Python Technology"
                    icon={<path d="M12 3l7 4v6c0 5-3 9-7 9s-7-4-7-9V7l7-4z" />}
                  /><FeatureItem
                    title="Clean Rosters"
                    desc="Per-student predictions with risk scoring."
                    icon={<path d="M4 7h16M4 12h16M4 17h10" />}
                  />
                  <FeatureItem
                    title="Modern UI"
                    desc="Responsive dashboard built with React."
                    icon={<path d="M4 6h16M7 6v12m10-12v12M6 18h12" />}
                  />
                </div>
              </section>

              {/* Right Side: Login Card */}
              <aside className="lg:col-span-5 xl:col-span-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-[1.8rem] opacity-30 blur-sm group-hover:opacity-50 transition duration-1000"></div>

                  <div className="relative bg-white/90 backdrop-blur-xl border border-white/40 rounded-[1.75rem] p-7 sm:p-8 shadow-2xl">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Login</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 12a5 5 0 100-10 5 5 0 000 10zm7 10a7 7 0 10-14 0h14z" />
                          </svg>
                        </span>
                        <input
                          type="email"
                          required
                          placeholder="Email address"
                          className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>

                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V8a4 4 0 10-8 0v3m-2 0h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a2 2 0 012-2z" />
                          </svg>
                        </span>
                        <input
                          type="password"
                          required
                          placeholder="Password"
                          className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-blue-600"
                            onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                          />
                          Remember me
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-full py-3.5 font-semibold text-white shadow-lg bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        Sign In
                      </button>

                      <p className="text-center text-sm text-slate-600">
                        No Account yet? <span className="font-semibold text-blue-600 hover:underline cursor-pointer">Register</span>
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

export default LoginPage;