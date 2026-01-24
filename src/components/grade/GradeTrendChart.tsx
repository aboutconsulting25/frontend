'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface DataPoint {
  semester: string;
  grade: number;
}

interface GradeTrendChartProps {
  title: string;
  data: DataPoint[];
}

export default function GradeTrendChart({ title, data }: GradeTrendChartProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-base font-medium text-gray-900 text-center mb-4">
        {title}
      </h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#E5E7EB" />
            <XAxis
              dataKey="semester"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              dy={10}
            />
            <YAxis
              domain={[0, 9]}
              ticks={[0, 3, 6, 9]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              dx={-10}
            />
            <Tooltip
              formatter={(value: number) => [`${value}등급`, '평균']}
              labelFormatter={(label) => `${label} 학기`}
            />
            <Line
              type="linear"
              dataKey="grade"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#F59E0B', stroke: '#F59E0B', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#F59E0B' }}
              label={{
                position: 'top',
                fontSize: 11,
                fill: '#374151',
                dy: -8,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
