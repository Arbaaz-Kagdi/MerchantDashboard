import React from 'react';
import { CheckCircle2, Clock, XCircle, RotateCcw } from 'lucide-react';

export const StatusBadge = ({ status, size = 'md' }) => {
  const config = {
    Success: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
      icon: CheckCircle2,
      label: 'Success',
      dot: 'bg-emerald-500',
    },
    Pending: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
      icon: Clock,
      label: 'Pending',
      dot: 'bg-amber-500',
    },
    Failed: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800',
      icon: XCircle,
      label: 'Failed',
      dot: 'bg-rose-500',
    },
    Refunded: {
      bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800',
      icon: RotateCcw,
      label: 'Refunded',
      dot: 'bg-purple-500',
    },
  }[status] || {
    bg: 'bg-slate-50 text-slate-700 border-slate-200',
    icon: Clock,
    label: status,
    dot: 'bg-slate-400',
  };

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses} font-semibold transition-colors`}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};

