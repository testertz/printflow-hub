import { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/StatusBadge';
import { Input } from '@/components/ui/input';
import { mockDocuments } from '@/services/api';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function DeliverTasks() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter documents that are collected by THIS runner
  const deliveryTasks = mockDocuments.filter(d => 
    d.printStatus === 'collected' && d.runnerId === user?.id
  );

  const filteredTasks = deliveryTasks.filter(doc =>
    doc.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <CardTitle>My Delivery Tasks</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Documents you've picked up for delivery</p>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by document, student, or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead className="hidden md:table-cell">Student</TableHead>
                    <TableHead className="hidden sm:table-cell text-center">Class</TableHead>
                    <TableHead className="hidden lg:table-cell text-center">Pages</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No documents for delivery
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTasks.map((task, index) => (
                    <motion.tr
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-accent/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-medium text-sm sm:text-base truncate block">{task.fileName}</span>
                            <div className="md:hidden text-xs text-muted-foreground">{task.studentName}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{task.studentName}</TableCell>
                      <TableCell className="hidden sm:table-cell text-center">
                        <div className="flex items-center justify-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{task.className}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-center">{task.pages}</TableCell>
                      <TableCell className="text-center">
                        <StatusBadge status={task.printStatus as any} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="default" size="sm" className="text-xs sm:text-sm">
                              <span className="hidden sm:inline">Mark as Delivered</span>
                              <span className="sm:hidden">Deliver</span>
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
