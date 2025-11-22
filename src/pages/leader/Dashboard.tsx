import { motion } from 'framer-motion';
import { Package, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { mockDocuments } from '@/services/api';

export default function LeaderDashboard() {
  const deliveredDocs = mockDocuments.filter(d => d.printStatus === 'delivered').length;
  const pendingCollection = mockDocuments.filter(d => d.printStatus === 'with_runner').length;
  const completedDocs = mockDocuments.filter(d => d.printStatus === 'completed').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leader Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage document deliveries for your class</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Delivered
              </CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <AnimatedCounter value={deliveredDocs} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Documents delivered
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Collection
              </CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <AnimatedCounter value={pendingCollection} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting confirmation
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <AnimatedCounter value={completedDocs} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Successfully completed
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
