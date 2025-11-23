import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Printer, Package, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { mockDocuments } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { toast } from 'sonner';

export default function StationaryDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState(mockDocuments);

  const totalDocuments = documents.length;
  const pendingPrint = documents.filter(d => d.printStatus === 'pending' && d.paymentStatus === 'paid').length;
  const printed = documents.filter(d => d.printStatus === 'printed').length;

  const filteredDocuments = documents.filter(doc =>
    doc.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarkAsPrinted = (docId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, printStatus: 'printed' } : doc
    ));
    toast.success('Document marked as printed');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stationary Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage printing operations and inventory</p>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Documents
              </CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">
                <AnimatedCounter value={totalDocuments} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All submitted documents
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
                Pending Print
              </CardTitle>
              <Printer className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">
                <AnimatedCounter value={pendingPrint} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ready to print
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
                Printed
              </CardTitle>
              <Package className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">
                <AnimatedCounter value={printed} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ready for pickup
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
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
                  <TableHead>Student</TableHead>
                  <TableHead className="hidden sm:table-cell">Pages</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc, index) => (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-accent/50"
                  >
                    <TableCell className="font-medium">{doc.fileName}</TableCell>
                    <TableCell>{doc.studentName}</TableCell>
                    <TableCell className="hidden sm:table-cell">{doc.pages}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className={doc.printType === 'color' ? 'text-primary' : 'text-muted-foreground'}>
                        {doc.printType === 'color' ? 'Color' : 'B/W'}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={doc.printStatus as any} />
                    </TableCell>
                    <TableCell className="text-right">
                      {doc.printStatus === 'pending' && doc.paymentStatus === 'paid' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsPrinted(doc.id)}
                        >
                          Mark Printed
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
