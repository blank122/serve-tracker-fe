const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">System Administration</h1>
        <div className="flex gap-2">
           <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
             <span className="h-2 w-2 bg-amber-500 rounded-full animate-pulse"></span>
             3 Pending Approvals
           </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 font-bold text-slate-900">User Approval Queue</div>
        <div className="divide-y divide-slate-100">
          {[
            { email: 'sarah.smith@univ.edu', role: 'Instructor', date: '2026-02-14' },
            { email: 'mike.registrar@univ.edu', role: 'Registrar', date: '2026-02-15' }
          ].map((request) => (
            <div key={request.email} className="p-6 flex items-center justify-between hover:bg-slate-50 transition">
              <div>
                <p className="font-bold text-slate-900">{request.email}</p>
                <p className="text-xs text-slate-500">Requested Role: {request.role} • {request.date}</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg">Deny</button>
                <button className="px-4 py-1.5 text-sm font-semibold text-white bg-slate-900 rounded-lg shadow-md">Approve</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;