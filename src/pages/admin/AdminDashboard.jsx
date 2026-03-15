import React from 'react';
import { useAdminStats } from '../../hooks/useAdminStats';
import { Users, UserCheck, AlertTriangle, Zap, BookOpen, TrendingUp, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import DashboardSkeleton from '../../components/DashboardSkeleton';
import StatCard from '../../components/StatCard';

const AdminDashboard = () => {
  // Assuming your hook now returns: { stats, analytics, coursesData, trends, loading, error }
  const { stats, analytics, coursesData, trends, loading, error } = useAdminStats();

  if (loading) return <DashboardSkeleton />;
  if (error) return <div className="p-8 text-red-500 bg-red-50 rounded-xl font-bold">{error}</div>;

  const pieData = [
    { name: 'Safe', value: analytics?.active_safe || 0, color: '#10b981' },
    { name: 'At Risk', value: analytics?.active_at_risk || 0, color: '#f59e0b' } // Amber for Risk
  ];

  return (
    <div className="space-y-8 pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Overview</h1>
          <p className="text-slate-500 font-medium italic">Dashboard / Academic Year {analytics?.year}</p>
        </div>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-200">
          <Calendar size={18} />
          <span className="font-black text-sm uppercase">Class of {analytics?.year}</span>
        </div>
      </header>

      {/* --- ROW 1: STAT CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Students" value={stats?.total_students} colorClass="bg-blue-50 text-blue-600" />
        <StatCard icon={BookOpen} label="Total Courses" value={coursesData?.total_courses} colorClass="bg-purple-50 text-purple-600" />
        <StatCard 
            icon={Zap} 
            label="Current Year Risk" 
            value={analytics?.active_at_risk} 
            colorClass="bg-amber-50 text-amber-600" 
            subValue={`Top Section: ${analytics?.top_performing_section}`}
        />
        <StatCard 
            icon={AlertTriangle} 
            label="Pending Tasks" 
            value={stats?.pending_approvals} 
            colorClass={stats?.pending_approvals > 0 ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-400"} 
        />
      </div>

      {/* --- ROW 2: VISUAL ANALYTICS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Distribution (Pie) */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Risk Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} cornerRadius={10} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
             {pieData.map(item => (
                 <div key={item.name} className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                     <span className="text-xs font-bold text-slate-500">{item.name} ({item.value}%)</span>
                 </div>
             ))}
          </div>
        </div>

        {/* Passing Rate Trends (Line Chart) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Passing Rate Trends</h3>
            <TrendingUp className="text-emerald-500" size={20} />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#94a3b8' }} unit="%" />
                <Tooltip />
                <Line type="monotone" dataKey="average_passing_rate" stroke="#2563eb" strokeWidth={4} dot={{ r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- ROW 3: COURSE MANAGEMENT TABLE --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-black text-slate-800 tracking-tight">Course Management Catalog</h3>
            <span className="bg-white px-4 py-1 rounded-full text-[10px] font-black text-slate-400 border border-slate-200">Total: {coursesData?.total_courses}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th className="p-6">Course Details</th>
                <th className="p-6">Cohort Size</th>
                <th className="p-6">Instructors</th>
                <th className="p-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {coursesData?.courses?.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-6">
                    <p className="font-black text-slate-700 group-hover:text-blue-600 transition-colors">{course.name}</p>
                    <p className="text-xs font-bold text-slate-400">{course.code}</p>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                        <span className="font-black text-slate-700">{course.total_students} Students</span>
                        <span className="text-[10px] font-bold text-slate-400">{course.sections} Sections</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-slate-600">
                        <UserCheck size={16} className="text-indigo-400" />
                        <span className="font-bold">{course.instructors}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      course.status === 'completed' 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-amber-50 text-amber-600 animate-pulse'
                    }`}>
                      {course.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;