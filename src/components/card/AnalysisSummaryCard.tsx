interface AnalysisSummaryCardProps {
  title: string;
  items: string[];
  variant?: 'default' | 'muted';
  numbered?: boolean;
  className?: string;
}

const variantStyles = {
  default: {
    container: 'bg-white',
    divider: 'border-[#F7F7F7]',
  },
  muted: {
    container: 'bg-[#F6F8FA]',
    divider: 'border-[#E9E9E9]',
  },
};

export default function AnalysisSummaryCard({
  title,
  items,
  variant = 'default',
  numbered = true,
  className = '',
}: AnalysisSummaryCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className={`${styles.container} border border-[#BCD0DC] rounded-xl p-6 ${className}`}>
      <h3 className="text-xl font-medium text-gray-900 mb-4">{title}</h3>
      <div className={`my-4 border-t ${styles.divider}`} />
      <ul className="space-y-2 text-sm text-gray-700">
        {items.map((item, index) => (
          <li key={index}>{numbered ? `${index + 1}. ${item}` : item}</li>
        ))}
      </ul>
    </div>
  );
}
