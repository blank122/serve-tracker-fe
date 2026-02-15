const RegistrarDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Registrar Control Panel</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Management Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Section Status</h3>
          <div className="space-y-4">
            {['BSIT-3A', 'BSIT-3B', 'BSCS-2A'].map((section) => (
              <div key={section} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="font-medium text-slate-700">{section}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold">Verified</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grade Submission Progress */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Grade Submission Tracker</h3>
          <div className="flex items-center gap-4">
            <div className="h-24 w-24 rounded-full border-8 border-blue-600 flex items-center justify-center font-bold text-xl">82%</div>
            <div>
              <p className="text-sm text-slate-600">Total grades encoded for this term.</p>
              <button className="text-blue-600 text-sm font-semibold mt-2">Send Reminders to Instructors →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrarDashboard;