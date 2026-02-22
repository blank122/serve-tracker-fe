import React from 'react';
import { useAdminStats } from '../../hooks/useAdminStats';
import { Users, UserCheck, AlertTriangle, Trophy } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import DashboardSkeleton from '../../components/DashboardSkeleton';
import StatCard from '../../components/StatCard';

const AdminDashboard = () => {
  // All logic moved to the hook
  const { stats, analytics, rankings, loading, error } = useAdminStats();

  if (loading) return <DashboardSkeleton />;
  if (error) return <div className="p-8 text-red-500 bg-red-50 rounded-xl">{error}</div>;

  const pieData = [
    { name: 'Safe', value: analytics?.active_safe || 0, color: '#10b981' },
    { name: 'At Risk', value: analytics?.active_at_risk || 0, color: '#ef4444' }
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">2026 Academic Overview</h1>
        <p className="text-slate-500">ML-driven performance monitoring</p>
      </header>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Students" value={stats?.total_students} icon={<Users />} />
        <StatCard title="Instructors" value={stats?.total_instructors} icon={<UserCheck />} />
        <StatCard title="Pending" value={stats?.pending_approvals} icon={<AlertTriangle />} highlight={stats?.pending_approvals > 0} />
        <StatCard title="ML Risk" value={stats?.at_risk_count} icon={<AlertTriangle />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visual Analytics */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="font-semibold mb-4 text-slate-700">Student Risk Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PERFORMANCE RANKINGS */}
        <div className="space-y-4">
          {/* Use ?. and || [] to stay safe */}
          {(rankings || []).map((student, i) => (
            <RankingRow
              key={i}
              rank={i + 1}
              name={`${student[0]} ${student[1]}`}
              section={student[2]}
              grade={student[3]}
            />
          ))}

          {/* Optional: Show this if data is loaded but the array is empty */}
          {!loading && (!rankings || rankings.length === 0) && (
            <p className="text-slate-500 text-sm text-center py-4">
              No student data found for the current year.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;