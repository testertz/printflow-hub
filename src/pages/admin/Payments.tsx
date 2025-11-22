import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockDocuments } from '@/services/api';
import { toast } from 'sonner';

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const payments = mockDocuments.map(doc => ({
    id: doc.id,
    orderId: doc.id,
    studentName: doc.studentName,
    fileName: doc.fileName,
    amount: doc.cost,
    status: doc.paymentStatus,
    date: doc.uploadedAt,
  }));

  const filteredPayments = payments.filter(payment =>
    payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmPayment = (paymentId: string) => {
    toast.success('Payment confirmed successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments Management</h1>
        <p className="text-muted-foreground mt-2">Track and manage all payment transactions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Total Revenue', value: `₹${payments.reduce((sum, p) => sum + (p.status === 'paid' ? p.amount : 0), 0)}`, icon: CheckCircle, color: 'text-success' },
          { label: 'Pending Payments', value: payments.filter(p => p.status === 'pending').length, icon: Clock, color: 'text-warning' },
          { label: 'Failed Payments', value: payments.filter(p => p.status === 'failed').length, icon: XCircle, color: 'text-destructive' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payments..."
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
                  <TableHead>Order ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead className="text-center">Amount</TableHead>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment, index) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-accent/50"
                  >
                    <TableCell className="font-mono text-sm">{payment.orderId}</TableCell>
                    <TableCell className="font-medium">{payment.studentName}</TableCell>
                    <TableCell>{payment.fileName}</TableCell>
                    <TableCell className="text-center font-medium">₹{payment.amount}</TableCell>
                    <TableCell className="text-center text-sm">
                      {new Date(payment.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={payment.status as any} />
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.status === 'pending' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleConfirmPayment(payment.id)}
                        >
                          Confirm
                        </Button>
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
