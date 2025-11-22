import { motion } from 'framer-motion';
import { Truck, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/StatusBadge';
import { mockDocuments } from '@/services/api';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function DeliverTasks() {
  const deliveryTasks = mockDocuments.filter(d => d.printStatus === 'with_runner');

  const handleMarkDelivered = (taskId: string) => {
    toast.success('Document marked as delivered');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Delivery Tasks</h1>
        <p className="text-muted-foreground mt-2">Documents to be delivered to class leaders</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Out for Delivery</CardTitle>
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
                  {deliveryTasks.map((task, index) => (
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
                            <Truck className="h-5 w-5 text-primary" />
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="default" size="sm">
                              Mark as Delivered
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Delivery</DialogTitle>
                              <DialogDescription>
                                Please confirm that you have delivered this document to the class leader.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <div className="space-y-2">
                                <p className="text-sm"><strong>Document:</strong> {task.fileName}</p>
                                <p className="text-sm"><strong>Student:</strong> {task.studentName}</p>
                                <p className="text-sm"><strong>Class:</strong> {task.className}</p>
                                <p className="text-sm"><strong>Pages:</strong> {task.pages}</p>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline">Cancel</Button>
                              <Button onClick={() => handleMarkDelivered(task.id)}>
                                Confirm Delivery
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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
