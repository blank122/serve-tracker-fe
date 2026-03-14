import { Users, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import StudentList from './StudentList';
import StatCard from './StatCard';

const SectionAnalytics = ({ data }) => {
    if (!data || !data.summary_stats) {
        return (
            <div className="p-8 bg-white rounded-2xl border border-dashed border-slate-300 text-center text-slate-500 font-medium">
                Loading section insights...
            </div>
        );
    }
    return (
        <div className="space-y-6 mb-10">
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Users}
                    label="Total Students"
                    value={data.total_students}
                    colorClass="bg-blue-50 text-blue-600"
                />
                <StatCard
                    icon={CheckCircle}
                    label="Passing Rate"
                    value={`${data.summary_stats.passing_rate}%`}
                    subValue={`${data.summary_stats.passing_students} Students`}
                    colorClass="bg-emerald-50 text-emerald-600"
                />
                <StatCard
                    icon={AlertTriangle}
                    label="At Risk"
                    value={data.summary_stats.at_risk_count}
                    colorClass="bg-rose-50 text-rose-600"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Avg. Score"
                    value={data.summary_stats.average_section_score}
                    colorClass="bg-violet-50 text-violet-600"
                />
            </div>

            {/* Main Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Grade Distribution Visual */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">Grade Distribution</h3>
                    <div className="space-y-4">
                        {Object.entries(data.grade_distribution).map(([key, val]) => (
                            <div key={key}>
                                <div className="flex justify-between text-xs mb-1 uppercase font-semibold text-slate-500">
                                    <span>{key.split(' ')[0]}</span>
                                    <span>{val}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-blue-500 h-full rounded-full"
                                        style={{ width: `${(val / data.total_students) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Performing List */}
                <StudentList title="Top Performers" students={data.top_students.slice(0, 5)} />

                {/* Critical Attention List */}
                <StudentList title="Attention Needed" students={data.at_risk_students.slice(0, 5)} />
            </div>
        </div>
    );
};

export default SectionAnalytics;