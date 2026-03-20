import React, { useState } from 'react';
import pnpLogo from '../../assets/img/left-logo.png';
import policeBg from '../../assets/img/police-bg.jpg';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstname: '',
    lastname: '',
    gender: '',
    role: 'instructor'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // First name validation
    if (!formData.firstname) {
      newErrors.firstname = 'First name is required';
    }

    // Last name validation
    if (!formData.lastname) {
      newErrors.lastname = 'Last name is required';
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError('');

    // Prepare data for API - remove confirmPassword
    const { confirmPassword, ...registrationData } = formData;

    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      // Registration successful
      setRegistrationSuccess(true);

      // Optional: Store user info in localStorage/sessionStorage
      // localStorage.setItem('pendingUser', JSON.stringify(data.user));

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      console.error('Registration error:', error);
      setApiError(error.message || 'An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen antialiased text-slate-900 relative overflow-hidden">
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(2,6,23,.92) 0%, rgba(2,6,23,.62) 46%, rgba(2,6,23,.30) 100%),
              radial-gradient(1200px 600px at 15% 30%, rgba(59,130,246,.25), transparent 60%),
              radial-gradient(900px 500px at 80% 20%, rgba(16,185,129,.18), transparent 55%),
              url(${policeBg})`
          }}
        />
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white/92 backdrop-blur-xl border border-white/45 rounded-[1.75rem] p-8 max-w-md mx-4 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Successful!</h2>
            <p className="text-slate-600 mb-4">
              Your account has been created and is pending approval. You'll receive an email once your account is approved.
            </p>
            <p className="text-sm text-slate-500">
              Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            url(${policeBg})`
        }}
      />
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full max-w-7xl mx-auto px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/10 ring-1 ring-white/20 flex items-center justify-center overflow-hidden">
              <img src={pnpLogo} className="h-full w-full object-cover" alt="ServeTrack Logo" />
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
                  Get Started with<br className="hidden sm:block" />
                  ServeTrack
                </h1>

                <p className="mt-4 text-white/75 max-w-2xl text-base sm:text-lg leading-relaxed">
                  Register to access course management, student tracking, and performance insights — built for speed, clarity, and security.
                </p>

                <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-2xl">
                  <FeatureItem
                    title="Account Approval"
                    desc="New accounts require admin or registrar verification."
                    icon={<path d="M12 3l7 4v6c0 5-3 9-7 9s-7-4-7-9V7l7-4z" />}
                  />
                  <FeatureItem
                    title="Role-based Access"
                    desc="Specific views for Instructors and Registrars."
                    icon={<path d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm7 10a7 7 0 10-14 0h14z" />}
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

                    {apiError && (
                      <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                        {apiError}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* First Name and Last Name Row */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <input
                            type="text"
                            name="firstname"
                            required
                            placeholder="First Name"
                            value={formData.firstname}
                            onChange={handleChange}
                            className={`w-full rounded-xl border ${errors.firstname ? 'border-red-500' : 'border-slate-200'} bg-white px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all`}
                          />
                          {errors.firstname && (
                            <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>
                          )}
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            name="lastname"
                            required
                            placeholder="Last Name"
                            value={formData.lastname}
                            onChange={handleChange}
                            className={`w-full rounded-xl border ${errors.lastname ? 'border-red-500' : 'border-slate-200'} bg-white px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all`}
                          />
                          {errors.lastname && (
                            <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>
                          )}
                        </div>
                      </div>

                      {/* Email Input */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8l8 5 8-5M4 8v10a2 2 0 002 2h12a2 2 0 002-2V8M4 8l8-5 8 5" />
                          </svg>
                        </span>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full rounded-xl border ${errors.email ? 'border-red-500' : 'border-slate-200'} bg-white px-11 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all`}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>

                      {/* Gender Selection */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </span>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className={`w-full appearance-none rounded-xl border ${errors.gender ? 'border-red-500' : 'border-slate-200'} bg-white px-11 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer`}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <span className="absolute inset-y-0 right-3 flex items-center text-slate-400 pointer-events-none">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 9l6 6 6-6" />
                          </svg>
                        </span>
                        {errors.gender && (
                          <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                        )}
                      </div>

                      {/* Password Input */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V8a4 4 0 10-8 0v3m-2 0h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a2 2 0 012-2z" />
                          </svg>
                        </span>
                        <input
                          type="password"
                          name="password"
                          required
                          minLength="6"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full rounded-xl border ${errors.password ? 'border-red-500' : 'border-slate-200'} bg-white px-11 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all`}
                        />
                        {errors.password && (
                          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                      </div>

                      {/* Confirm Password Input */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4V8a4 4 0 00-8 0v3h8z" />
                          </svg>
                        </span>
                        <input
                          type="password"
                          name="confirmPassword"
                          required
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200'} bg-white px-11 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all`}
                        />
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 px-1 italic">Minimum 6 characters required.</p>

                      {/* Role Selection */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 12a5 5 0 100-10 5 5 0 000 10zm7 10a7 7 0 10-14 0h14z" />
                          </svg>
                        </span>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className={`w-full appearance-none rounded-xl border ${errors.role ? 'border-red-500' : 'border-slate-200'} bg-white px-11 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer`}
                        >
                          <option value="instructor">Instructor</option>
                          <option value="registrar">Registrar</option>
                        </select>
                        <span className="absolute inset-y-0 right-3 flex items-center text-slate-400 pointer-events-none">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 9l6 6 6-6" />
                          </svg>
                        </span>
                        {errors.role && (
                          <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 px-1 italic">New accounts require manual approval before sign-in.</p>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full mt-2 rounded-full py-3.5 font-semibold text-white shadow-lg bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 hover:scale-[1.02] active:scale-[0.98] transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </button>

                      <p className="text-center text-sm text-slate-600 pt-2">
                        Already have an account?{' '}
                        <span
                          onClick={() => navigate('/login')}
                          className="font-semibold text-blue-600 hover:underline cursor-pointer"
                        >
                          Login here
                        </span>
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