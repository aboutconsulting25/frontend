'use client';

interface GoalCardProps {
  title: string;
  goal: string;
}

export default function GoalCard({ title, goal }: GoalCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-base font-medium text-gray-900 mb-4">{title}</h3>
      <p className="text-xl font-bold text-gray-900">{goal}</p>
    </div>
  );
}
