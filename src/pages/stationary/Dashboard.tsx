import { motion } from 'framer-motion';
import { Package, AlertTriangle, TrendingUp, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { mockInventory } from '@/services/api';

export default function StationaryDashboard() {
  const totalPaper = mockInventory
    .filter(item => item.category === 'paper')
    .reduce((sum, item) => sum + item.quantity, 0);
  
  const tonerLevel = mockInventory
    .filter(item => item.category === 'toner')
    .reduce((sum, item) => sum + item.quantity, 0);
  
  const lowStockItems = mockInventory.filter(item => item.quantity < item.minThreshold).length;
  
  const dailyUsage = 1250;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory Dashboard</h1>
        <p className="text-muted-foreground mt-2">Monitor and manage stationery inventory</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Paper Sheets
              </CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <AnimatedCounter value={totalPaper} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Available sheets
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
                Toner Levels
              </CardTitle>
              <Package className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <AnimatedCounter value={tonerLevel} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Units available
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
                Low Stock Items
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <AnimatedCounter value={lowStockItems} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Need attention
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Daily Usage
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <AnimatedCounter value={dailyUsage} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Sheets per day
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockInventory.slice(0, 5).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.quantity} {item.unit}</p>
                    {item.quantity < item.minThreshold ? (
                      <p className="text-xs text-destructive">Below threshold</p>
                    ) : (
                      <p className="text-xs text-success">In stock</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
