import React from 'react';

const InstructorDashboard = () => {
  const stats = [
    { label: 'Total Students', value: '142', change: '+4 this week' },
    { label: 'At-Risk Students', value: '12', color: 'text-red-600' },
    { label: 'Model Accuracy', value: '94.2%', change: 'Random Forest' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Instructor Overview</h1>
          <p className="text-slate-500 text-sm">Monitor student success and predictive alerts.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
          Run New Prediction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{s.label}</p>
            <p className={`text-3xl font-bold mt-2 ${s.color || 'text-slate-900'}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Recent At-Risk Alerts</h3>
          <span className="text-xs font-semibold bg-red-100 text-red-600 px-2 py-1 rounded">Action Required</span>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Student Name</th>
              <th className="px-6 py-4">Current Grade</th>
              <th className="px-6 py-4">Risk Probability</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            <tr>
              <td className="px-6 py-4 font-medium text-slate-900">John Doe</td>
              <td className="px-6 py-4">74.5%</td>
              <td className="px-6 py-4 text-red-500 font-bold">88% (High)</td>
              <td className="px-6 py-4 text-right"><button className="text-blue-600 hover:underline">View Profile</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstructorDashboard;