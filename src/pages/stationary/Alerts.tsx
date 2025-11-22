import { motion } from 'framer-motion';
import { AlertTriangle, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { mockInventory } from '@/services/api';

export default function Alerts() {
  const lowStockItems = mockInventory.filter(item => item.quantity < item.minThreshold);
  const criticalItems = mockInventory.filter(item => item.quantity < item.minThreshold * 0.5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stock Alerts</h1>
        <p className="text-muted-foreground mt-2">Items that need immediate attention</p>
      </div>

      {criticalItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">Critical Stock Alerts</CardTitle>
              </div>
              <CardDescription>
                These items are critically low and need immediate restocking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criticalItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border-2 border-destructive/20 bg-background"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                        <Package className="h-6 w-6 text-destructive" />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {item.category} • Min: {item.minThreshold} {item.unit}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-destructive">{item.quantity}</p>
                      <p className="text-sm text-muted-foreground">{item.unit} remaining</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: criticalItems.length > 0 ? 0.2 : 0 }}
      >
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <CardTitle className="text-warning">Low Stock Warnings</CardTitle>
            </div>
            <CardDescription>
              Items below minimum threshold that need restocking soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">All items are adequately stocked</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (criticalItems.length > 0 ? 0.2 : 0) + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
                        <Package className="h-6 w-6 text-warning" />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {item.category} • Min: {item.minThreshold} {item.unit}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{item.quantity}</p>
                      <p className="text-sm text-muted-foreground">{item.unit} remaining</p>
                      <StatusBadge status="low_stock" className="mt-1" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
