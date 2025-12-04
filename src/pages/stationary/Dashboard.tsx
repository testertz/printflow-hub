import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Printer, Package, Search, PrinterIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { mockDocuments } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function StationaryDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [documents, setDocuments] = useState(mockDocuments);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalDocuments = documents.length;
  const pendingPrint = documents.filter(d => d.printStatus === 'pending' && d.paymentStatus === 'paid').length;
  const printed = documents.filter(d => d.printStatus === 'printed').length;

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.printStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, startIndex + itemsPerPage);

  const handleMarkAsPrinted = (docId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, printStatus: 'printed' } : doc
    ));
    toast.success('Document marked as printed');
  };

  const handlePrintDocument = (docId: string, fileName: string) => {
    // Find the specific document
    const doc = documents.find(d => d.id === docId);
    if (!doc) {
      toast.error('Document not found');
      return;
    }
    
    // Create a printable view for the specific document
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Print: ${fileName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .info-row { display: flex; margin: 8px 0; }
            .label { font-weight: bold; width: 150px; }
            .value { flex: 1; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Print Job Details</h1>
            <p>Document ID: ${doc.id}</p>
          </div>
          <div class="info-row"><span class="label">File Name:</span><span class="value">${doc.fileName}</span></div>
          <div class="info-row"><span class="label">Student:</span><span class="value">${doc.studentName}</span></div>
          <div class="info-row"><span class="label">Pages:</span><span class="value">${doc.pages}</span></div>
          <div class="info-row"><span class="label">Print Type:</span><span class="value">${doc.printType === 'color' ? 'Color' : 'Black & White'}</span></div>
          <div class="info-row"><span class="label">Delivery:</span><span class="value">${doc.deliveryType === 'delivery' ? 'Delivery to: ' + (doc.location || 'N/A') : 'Self Pickup'}</span></div>
          <div class="info-row"><span class="label">Status:</span><span class="value">${doc.printStatus}</span></div>
          <div class="info-row"><span class="label">Payment:</span><span class="value">${doc.paymentStatus}</span></div>
          <hr style="margin: 20px 0;" />
          <p><em>This is a print job slip. The actual document file should be printed separately.</em></p>
          <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; cursor: pointer;">Print This Slip</button>
        </body>
        </html>
      `);
      printWindow.document.close();
      toast.success(`Print window opened for ${fileName}`);
    } else {
      toast.error('Could not open print window. Please allow popups.');
    }
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
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="printed">Printed</SelectItem>
                <SelectItem value="collected">Collected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead className="hidden md:table-cell">Student</TableHead>
                  <TableHead className="hidden sm:table-cell">Pages</TableHead>
                  <TableHead className="hidden lg:table-cell">Type</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDocuments.map((doc, index) => (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-accent/50"
                  >
                    <TableCell className="font-medium">
                      <div className="min-w-0">
                        <span className="text-sm sm:text-base truncate block">{doc.fileName}</span>
                        <div className="md:hidden text-xs text-muted-foreground">{doc.studentName}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{doc.studentName}</TableCell>
                    <TableCell className="hidden sm:table-cell">{doc.pages}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className={doc.printType === 'color' ? 'text-primary' : 'text-muted-foreground'}>
                        {doc.printType === 'color' ? 'Color' : 'B/W'}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={doc.printStatus as any} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePrintDocument(doc.id, doc.fileName)}
                          title="Print Document"
                          className="text-xs sm:text-sm"
                        >
                          <PrinterIcon className="h-4 w-4" />
                          <span className="ml-1 hidden sm:inline">Print</span>
                        </Button>
                        {doc.printStatus === 'pending' && doc.paymentStatus === 'paid' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsPrinted(doc.id)}
                            className="text-xs sm:text-sm"
                          >
                            <span className="hidden sm:inline">Mark Printed</span>
                            <span className="sm:hidden">Printed</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
