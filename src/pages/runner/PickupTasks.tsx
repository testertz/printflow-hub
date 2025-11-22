import { motion } from 'framer-motion';
import { Package, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/StatusBadge';
import { mockDocuments } from '@/services/api';
import { toast } from 'sonner';

export default function PickupTasks() {
  const pickupTasks = mockDocuments.filter(d => d.printStatus === 'ready');

  const handleMarkPicked = (taskId: string) => {
    toast.success('Document marked as picked up');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pickup Tasks</h1>
        <p className="text-muted-foreground mt-2">Documents ready for pickup from print center</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Ready for Pickup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-center">Class</TableHead>
                    <TableHead className="text-center">Pages</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pickupTasks.map((task, index) => (
                    <motion.tr
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-accent/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-medium">{task.fileName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{task.studentName}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {task.className}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{task.pages}</TableCell>
                      <TableCell className="text-center">
                        <StatusBadge status={task.printStatus as any} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleMarkPicked(task.id)}
                        >
                          Mark as Picked
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
