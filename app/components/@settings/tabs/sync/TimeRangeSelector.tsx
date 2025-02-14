import { classNames } from '~/utils/classNames';
import { motion } from 'framer-motion';
import type { TimeRange } from '~/types/sync';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  options: Array<{
    value: TimeRange;
    label: string;
  }>;
}

export default function TimeRangeSelector({ value, onChange, options }: TimeRangeSelectorProps) {
  return (
    <motion.div
      className={classNames(
        'flex items-center gap-2 px-3 py-2 rounded-lg',
        'bg-bolt-elements-background-depth-2',
        'hover:bg-bolt-elements-background-depth-3',
        'transition-all duration-200',
        'border border-bolt-elements-borderColor/10',
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="i-ph:timer text-purple-500 w-4 h-4" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TimeRange)}
        className={classNames(
          'text-sm text-bolt-elements-textPrimary',
          'bg-transparent border-none outline-none',
          'cursor-pointer appearance-none',
          'focus:ring-0 focus:outline-none',
          'pr-6',
        )}
        style={{
          WebkitAppearance: 'none',
          MozAppearance: 'none',
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="i-ph:caret-down text-bolt-elements-textSecondary w-4 h-4" />
    </motion.div>
  );
}
