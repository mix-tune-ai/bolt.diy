import { classNames } from '~/utils/classNames';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  _color?: string;
  trend?: {
    value: number;
    label: string;
  };
}

export default function StatsCard({ icon, label, value, _color = 'blue', trend }: StatsCardProps) {
  return (
    <div
      className={classNames(
        'p-4 rounded-lg border',
        'bg-bolt-elements-background-depth-4',
        'border-bolt-elements-borderColor/10',
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={classNames('text-2xl text-bolt-elements-textTertiary', icon)} />
          <div>
            <div className="text-sm text-bolt-elements-textSecondary">{label}</div>
            <div className="text-lg font-medium text-bolt-elements-textPrimary">{value}</div>
          </div>
        </div>
        {trend && (
          <div
            className={classNames('flex items-center gap-1 text-sm', {
              'text-green-500': trend.value > 0,
              'text-red-500': trend.value < 0,
              'text-bolt-elements-textTertiary': trend.value === 0,
            })}
          >
            {trend.value > 0 && <div className="i-ph:trend-up-duotone" />}
            {trend.value < 0 && <div className="i-ph:trend-down-duotone" />}
            {trend.value === 0 && <div className="i-ph:minus-duotone" />}
            <span>{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
