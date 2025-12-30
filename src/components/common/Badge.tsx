'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-blue-100 text-blue-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        info: 'bg-cyan-100 text-cyan-800',
        purple: 'bg-purple-100 text-purple-800',
        orange: 'bg-orange-100 text-orange-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// Status Badge with predefined status mappings
interface StatusBadgeProps {
  status: string;
  className?: string;
}

function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    pending: { variant: 'warning', label: '대기중' },
    analyzing: { variant: 'primary', label: '분석중' },
    completed: { variant: 'success', label: '완료' },
    reviewed: { variant: 'purple', label: '검토완료' },
    error: { variant: 'danger', label: '오류' },
    active: { variant: 'success', label: '활성' },
    inactive: { variant: 'default', label: '비활성' },
    draft: { variant: 'default', label: '초안' },
    published: { variant: 'success', label: '발행됨' },
    approved: { variant: 'info', label: '승인됨' },
    uploaded: { variant: 'info', label: '업로드됨' },
    analyzed: { variant: 'success', label: '분석완료' },
    failed: { variant: 'danger', label: '실패' },
    refunded: { variant: 'orange', label: '환불됨' },
  };

  const config = statusConfig[status] || { variant: 'default' as const, label: status };

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}

export { Badge, StatusBadge, badgeVariants };
