import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimelineStep {
  label: string;
  status: 'completed' | 'active' | 'pending';
  timestamp?: string;
}

interface AnimatedTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export const AnimatedTimeline = ({ steps, className }: AnimatedTimelineProps) => {
  return (
    <div className={cn('space-y-4', className)}>
      {steps.map((step, index) => {
        const isCompleted = step.status === 'completed';
        const isActive = step.status === 'active';
        const isLast = index === steps.length - 1;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-start gap-4"
          >
            {/* Connector Line */}
            {!isLast && (
              <div className="absolute left-5 top-10 w-0.5 h-full -ml-px">
                <motion.div
                  className={cn(
                    'w-full origin-top',
                    isCompleted ? 'bg-success' : 'bg-border'
                  )}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: isCompleted ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  style={{ height: '100%' }}
                />
              </div>
            )}

            {/* Status Icon */}
            <motion.div
              className={cn(
                'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2',
                isCompleted && 'border-success bg-success text-success-foreground',
                isActive && 'border-primary bg-primary text-primary-foreground animate-pulse',
                !isCompleted && !isActive && 'border-border bg-background text-muted-foreground'
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
            >
              {isCompleted ? (
                <Check className="h-5 w-5" />
              ) : (
                <Circle className={cn('h-5 w-5', isActive && 'fill-current')} />
              )}
            </motion.div>

            {/* Content */}
            <div className="flex-1 pt-1.5">
              <motion.p
                className={cn(
                  'font-medium',
                  isCompleted && 'text-foreground',
                  isActive && 'text-primary',
                  !isCompleted && !isActive && 'text-muted-foreground'
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.1 }}
              >
                {step.label}
              </motion.p>
              {step.timestamp && (
                <motion.p
                  className="text-xs text-muted-foreground mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {step.timestamp}
                </motion.p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
