interface SummaryCardProps {
  title: string;
  detail?: string;
  count: number;
  unit?: string;
  icon?: React.ReactNode;
  bgColor?: string;
}

export default function SummaryCard({
  title,
  detail,
  count,
  unit = '명',
  bgColor = 'bg-blue-500'
}: SummaryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200 flex flex-col">
      <div className="mb-6">
        <p className="text-black text-sm mb-1">{title}</p>
      </div>
      {detail && (
          <p className="text-gray-500 text-xs pb-1">{detail}</p>
        )}
      <p className="text-4xl font-bold text-gray-800 mt-auto">{count}{unit}</p>
    </div>
  );
}