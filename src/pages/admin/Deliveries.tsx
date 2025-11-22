import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { mockDocuments, mockUsers } from '@/services/api';
import { toast } from 'sonner';

export default function Deliveries() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const deliveries = mockDocuments
    .filter(doc => ['ready', 'with_runner', 'delivered'].includes(doc.printStatus))
    .map(doc => ({
      id: doc.id,
      fileName: doc.fileName,
      studentName: doc.studentName,
      className: doc.className,
      runnerId: doc.runnerId,
      status: doc.printStatus,
    }));

  const runners = mockUsers.filter(u => u.role === 'runner');

  const filteredDeliveries = deliveries.filter(delivery =>
    delivery.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignRunner = (deliveryId: string, runnerId: string) => {
    toast.success(`Runner assigned to delivery ${deliveryId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Delivery Management</h1>
        <p className="text-muted-foreground mt-2">Manage delivery assignments and tracking</p>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search deliveries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-center">Class</TableHead>
                  <TableHead className="text-center">Runner</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.map((delivery, index) => (
                  <motion.tr
                    key={delivery.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-accent/50"
                  >
                    <TableCell className="font-medium">{delivery.fileName}</TableCell>
                    <TableCell>{delivery.studentName}</TableCell>
                    <TableCell className="text-center">{delivery.className}</TableCell>
                    <TableCell className="text-center">
                      {delivery.runnerId ? (
                        <span className="inline-flex items-center gap-1 text-sm">
                          <Truck className="h-3 w-3" />
                          {delivery.runnerId}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={delivery.status as any} />
                    </TableCell>
                    <TableCell className="text-right">
                      {!delivery.runnerId && delivery.status === 'ready' && (
                        <Select onValueChange={(value) => handleAssignRunner(delivery.id, value)}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Assign runner" />
                          </SelectTrigger>
                          <SelectContent>
                            {runners.map(runner => (
                              <SelectItem key={runner.id} value={runner.id}>
                                {runner.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
