'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';

interface MockExamSummaryCardProps {
  title: string;
  mainValue: string;
  mainLabel?: string;
  items: {
    label: string;
    value: string;
    trend?: 'up' | 'down';
    color?: 'primary' | 'default';
  }[];
}

export default function MockExamSummaryCard({
  title,
  mainValue,
  mainLabel,
  items,
}: MockExamSummaryCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-sm text-gray-500 mb-2">{title}</h3>

      <div className="mb-4">
        <span className="text-4xl font-bold text-gray-900">{mainValue}</span>
        {mainLabel && <span className="text-sm text-gray-500 ml-2">{mainLabel}</span>}
      </div>

      <div className="space-y-2 pt-2 border-t border-gray-100">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{item.label}</span>
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                item.color === 'primary' ? 'text-primary-500' : 'text-gray-900'
              }`}
            >
              {item.value}
              {item.trend === 'up' && <TrendingUp className="w-4 h-4" />}
              {item.trend === 'down' && <TrendingDown className="w-4 h-4" />}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
