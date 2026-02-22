import React from 'react';

const StatCard = ({ title, value, icon, highlight }) => {
  return (
    <div 
      className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 ${
        highlight 
          ? 'bg-amber-50 border-amber-200 shadow-md shadow-amber-100' 
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        {/* Icon Container */}
        <div className={`p-2.5 rounded-xl ${
          highlight ? 'bg-amber-200 text-amber-700' : 'bg-slate-50 text-slate-600'
        }`}>
          {/* Clone the icon to inject size props if needed */}
          {React.cloneElement(icon, { size: 20, strokeWidth: 2.5 })}
        </div>

        {/* Optional: Small trend indicator or status dot */}
        {highlight && (
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        )}
      </div>

      <div className="space-y-1">
        <p className={`text-sm font-semibold uppercase tracking-wider ${
          highlight ? 'text-amber-700' : 'text-slate-500'
        }`}>
          {title}
        </p>
        
        <div className="flex items-baseline gap-2">
          <h2 className={`text-3xl font-black ${
            highlight ? 'text-amber-900' : 'text-slate-800'
          }`}>
            {value?.toLocaleString() || '0'}
          </h2>
          {/* You could add "Total" or units here if needed */}
        </div>
      </div>

      {/* Subtle Background Pattern for highlighted cards */}
      {highlight && (
        <div className="absolute -right-4 -bottom-4 opacity-5 text-amber-900">
           {React.cloneElement(icon, { size: 100 })}
        </div>
      )}
    </div>
  );
};

export default StatCard;