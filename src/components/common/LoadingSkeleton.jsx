import React from 'react';

export const LoadingSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {/* Desktop Table Skeleton */}
      <div className="hidden md:block overflow-hidden border border-slate-200 rounded-xl bg-white shadow-sm">
        <div className="h-12 bg-slate-100 border-b border-slate-200" />
        <div className="divide-y divide-slate-100">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 space-x-4">
              <div className="h-4 bg-slate-200 rounded w-28" />
              <div className="h-4 bg-slate-200 rounded w-36" />
              <div className="h-4 bg-slate-200 rounded w-24" />
              <div className="h-4 bg-slate-200 rounded w-20" />
              <div className="h-5 bg-slate-200 rounded-full w-24" />
              <div className="h-4 bg-slate-200 rounded w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card Skeleton */}
      <div className="md:hidden space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-slate-200 rounded w-32" />
              <div className="h-5 bg-slate-200 rounded-full w-20" />
            </div>
            <div className="h-3 bg-slate-200 rounded w-48" />
            <div className="flex justify-between pt-2">
              <div className="h-4 bg-slate-200 rounded w-24" />
              <div className="h-4 bg-slate-200 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

