import { classNames } from '~/utils/classNames';
import { motion } from 'framer-motion';
import { Progress } from '~/components/ui/Progress';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    label: string;
    progress: number;
  };
}

export default function StatsCard({ icon, label, value, trend }: StatsCardProps) {
  return (
    <motion.div
      className={classNames(
        'bg-bolt-elements-background-depth-2 rounded-xl p-5',
        'hover:bg-bolt-elements-background-depth-3',
        'transition-all duration-200',
        'border border-bolt-elements-borderColor/10',
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={classNames(icon, 'text-purple-500 w-5 h-5')} />
        <h3 className="text-sm font-medium text-bolt-elements-textPrimary">{label}</h3>
      </div>

      <div className="space-y-3">
        <div className="text-2xl font-semibold text-bolt-elements-textPrimary">{value}</div>

        {trend && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={classNames('text-xs font-medium', trend.value > 0 ? 'text-green-500' : 'text-red-500')}>
                {trend.label}
              </div>
              <div
                className={classNames(
                  'w-4 h-4',
                  trend.value > 0 ? 'i-ph:trend-up text-green-500' : 'i-ph:trend-down text-red-500',
                )}
              />
            </div>

            {trend.progress !== undefined && (
              <Progress
                value={trend.progress}
                className={classNames(
                  'h-1.5',
                  trend.value > 0 ? 'bg-green-500/10 [&>div]:bg-green-500' : 'bg-red-500/10 [&>div]:bg-red-500',
                )}
              />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
