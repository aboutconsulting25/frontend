interface InfoBoxProps {
  title: string;
  items: string[];
  variant?: 'gray' | 'blue' | 'green' | 'amber';
  maxWidth?: string;
  className?: string;
}

const variantStyles = {
  gray: {
    container: 'bg-gray-50 border-gray-200',
    icon: 'bg-gray-300',
    bullet: 'text-gray-400',
  },
  blue: {
    container: 'bg-blue-50 border-blue-200',
    icon: 'bg-blue-400',
    bullet: 'text-blue-400',
  },
  green: {
    container: 'bg-green-50 border-green-200',
    icon: 'bg-green-400',
    bullet: 'text-green-400',
  },
  amber: {
    container: 'bg-amber-50 border-amber-200',
    icon: 'bg-amber-400',
    bullet: 'text-amber-400',
  },
};

export default function InfoBox({
  title,
  items,
  variant = 'gray',
  maxWidth = '800px',
  className = '',
}: InfoBoxProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`${styles.container} border rounded-lg p-6 mx-auto ${className}`}
      style={{ maxWidth }}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-5 h-5 rounded-full ${styles.icon} flex items-center justify-center`}>
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-[14px] font-semibold text-gray-900 mb-3">{title}</h3>
          <ul className="space-y-1.5 text-[13px] text-gray-600">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className={styles.bullet}>•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
