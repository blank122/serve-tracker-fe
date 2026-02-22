import React from 'react';

const SkeletonPulse = ({ className }) => (
    <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />
);

const DashboardSkeleton = () => {
    return (
        <div className="space-y-8 p-1">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <SkeletonPulse className="h-8 w-64" />
                <SkeletonPulse className="h-4 w-48" />
            </div>

            {/* Stat Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                        <SkeletonPulse className="h-10 w-10 rounded-lg" />
                        <SkeletonPulse className="h-4 w-24" />
                        <SkeletonPulse className="h-8 w-16" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Skeleton */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
                    <SkeletonPulse className="h-6 w-32 self-start mb-8" />
                    <div className="h-48 w-48 rounded-full border-[16px] border-slate-100 animate-pulse flex items-center justify-center">
                         <div className="h-20 w-20 rounded-full border-[16px] border-slate-50" />
                    </div>
                    <div className="flex gap-4 mt-8">
                        <SkeletonPulse className="h-3 w-16" />
                        <SkeletonPulse className="h-3 w-16" />
                    </div>
                </div>

                {/* Rankings Skeleton */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                    <SkeletonPulse className="h-6 w-40" />
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-4">
                                <SkeletonPulse className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                    <SkeletonPulse className="h-4 w-32" />
                                    <SkeletonPulse className="h-3 w-20" />
                                </div>
                            </div>
                            <SkeletonPulse className="h-6 w-12" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;