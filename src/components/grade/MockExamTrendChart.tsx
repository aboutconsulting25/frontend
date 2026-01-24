'use client';

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface DataPoint {
  month: string;
  grade: number;
  percentile: number;
}

interface MockExamTrendChartProps {
  title: string;
  data: DataPoint[];
}

export default function MockExamTrendChart({ title, data }: MockExamTrendChartProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-base font-medium text-gray-900 text-center mb-4">
        {title}
      </h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              dy={10}
            />
            <YAxis
              yAxisId="left"
              domain={[0, 9]}
              ticks={[0, 3, 6, 9]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              dx={-10}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              ticks={[0, 40, 80, 100]}
              tickFormatter={(value) => `${value}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              dx={10}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'percentile') return [`${value}%`, '백분위'];
                return [`${value}등급`, '등급'];
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (value === 'grade' ? '등급' : '백분위')}
            />
            <Bar
              yAxisId="right"
              dataKey="percentile"
              fill="#93C5FD"
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
            <Line
              yAxisId="left"
              type="linear"
              dataKey="grade"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ fill: '#F59E0B', stroke: '#F59E0B', strokeWidth: 2, r: 5 }}
              label={{
                position: 'top',
                fontSize: 11,
                fill: '#374151',
                dy: -8,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
