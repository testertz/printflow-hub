import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, MapPin, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { mockDocuments } from '@/services/api';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function PickupTasks() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState(mockDocuments);
  
  // Filter documents that are printed and ready for pickup
  const pickupTasks = documents.filter(d => d.printStatus === 'printed' && d.paymentStatus === 'paid');

  const filteredTasks = pickupTasks.filter(doc =>
    doc.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarkPicked = (taskId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === taskId ? { ...doc, printStatus: 'collected', runnerId: user?.id || 'current-runner' } : doc
    ));
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
            <CardTitle>Documents Ready for Pickup</CardTitle>
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
                        No documents ready for pickup
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
                              <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
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
                          {task.runnerId && task.runnerId !== user?.id ? (
                            <Badge variant="secondary" className="text-xs">Picked by Other</Badge>
                          ) : (
                            <StatusBadge status={task.printStatus as any} />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {task.runnerId && task.runnerId !== user?.id ? (
                            <Badge variant="outline" className="text-xs">Unavailable</Badge>
                          ) : (
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleMarkPicked(task.id)}
                              className="text-xs sm:text-sm"
                            >
                              <span className="hidden sm:inline">Mark as Picked</span>
                              <span className="sm:hidden">Pick</span>
                            </Button>
                          )}
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
