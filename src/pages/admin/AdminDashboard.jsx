import React from 'react';
import { useAdminStats } from '../../hooks/useAdminStats';
import { Users, UserCheck, AlertTriangle, Trophy, Zap } from 'lucide-react';
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          icon={Users}
          label="Total Students"
          value={stats?.total_students ?? 0}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={UserCheck}
          label="Active Instructors"
          value={stats?.total_instructors ?? 0}
          colorClass="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          icon={AlertTriangle}
          label="Pending Approvals"
          value={stats?.pending_approvals ?? 0}
          // Conditional styling: turns rose if there's work to do
          colorClass={stats?.pending_approvals > 0 ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-400"}
          subValue={stats?.pending_approvals > 0 ? "Requires Action" : "All Clear"}
        />
        <StatCard
          icon={Zap}
          label="ML Risk Alert"
          value={stats?.at_risk_count ?? 0}
          colorClass="bg-amber-50 text-amber-600"
          subValue="Predictive Insight"
        />
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

      </div>
    </div>
  );
};

export default AdminDashboard;