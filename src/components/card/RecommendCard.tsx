interface RecommendCardProps {
  title: string;
  description: string;
  className?: string;
}

export default function RecommendCard({
  title,
  description,
  className = '',
}: RecommendCardProps) {
  return (
    <div className={`bg-[#FCFCFC] border border-[#E9E9E9] rounded-xl p-5 ${className}`}>
      <h4 className="text-sm font-bold text-primary-500 mb-3">{title}</h4>
      <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
