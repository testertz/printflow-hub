import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { mockDocuments } from '@/services/api';

export default function PrintJobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredJobs = mockDocuments.filter(job => {
    const matchesSearch = job.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.printStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Print Jobs Management</h1>
        <p className="text-muted-foreground mt-2">Monitor and manage all printing tasks</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by file or student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="uploaded">Uploaded</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="printing">Printing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="with_runner">With Runner</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-center">Class</TableHead>
                  <TableHead className="text-center">Pages</TableHead>
                  <TableHead className="text-center">Type</TableHead>
                  <TableHead className="text-center">Cost</TableHead>
                  <TableHead className="text-center">Payment</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job, index) => (
                  <motion.tr
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-accent/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium text-sm">{job.fileName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{job.studentName}</TableCell>
                    <TableCell className="text-center">{job.className}</TableCell>
                    <TableCell className="text-center">{job.pages}</TableCell>
                    <TableCell className="text-center">
                      <span className="uppercase text-xs font-medium">{job.printType}</span>
                    </TableCell>
                    <TableCell className="text-center font-medium">₹{job.cost}</TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={job.paymentStatus as any} />
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={job.printStatus as any} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Manage
                      </Button>
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
