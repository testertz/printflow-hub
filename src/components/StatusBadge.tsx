import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type StatusType = 
  | 'pending'
  | 'printed'
  | 'collected'
  | 'paid' 
  | 'failed'
  | 'active'
  | 'inactive'
  | 'low_stock'
  | 'in_stock';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/20' },
  printed: { label: 'Printed', className: 'bg-info/10 text-info border-info/20' },
  collected: { label: 'Collected', className: 'bg-success/10 text-success border-success/20' },
  paid: { label: 'Paid', className: 'bg-success/10 text-success border-success/20' },
  failed: { label: 'Failed', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  active: { label: 'Active', className: 'bg-success/10 text-success border-success/20' },
  inactive: { label: 'Inactive', className: 'bg-muted text-muted-foreground border-border' },
  low_stock: { label: 'Low Stock', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  in_stock: { label: 'In Stock', className: 'bg-success/10 text-success border-success/20' },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="outline" 
      className={cn(config.className, 'font-medium', className)}
    >
      {config.label}
    </Badge>
  );
};
