import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/StatusBadge';
import { mockDocuments } from '@/services/api';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ReceivedDocuments() {
  const receivedDocs = mockDocuments.filter(d => d.printStatus === 'delivered');

  const handleConfirmReceived = (docId: string) => {
    toast.success('Document receipt confirmed');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Received Documents</h1>
        <p className="text-muted-foreground mt-2">Confirm receipt of documents delivered by runners</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Pending Confirmation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-center">Pages</TableHead>
                    <TableHead className="text-center">Runner</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receivedDocs.map((doc, index) => (
                    <motion.tr
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-accent/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-medium">{doc.fileName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{doc.studentName}</TableCell>
                      <TableCell className="text-center">{doc.pages}</TableCell>
                      <TableCell className="text-center">{doc.runnerId || '—'}</TableCell>
                      <TableCell className="text-center">
                        <StatusBadge status={doc.printStatus as any} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="default" size="sm">
                              Confirm Receipt
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Document Receipt</DialogTitle>
                              <DialogDescription>
                                Please confirm that you have received this document from the runner.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <div className="space-y-2">
                                <p className="text-sm"><strong>Document:</strong> {doc.fileName}</p>
                                <p className="text-sm"><strong>Student:</strong> {doc.studentName}</p>
                                <p className="text-sm"><strong>Pages:</strong> {doc.pages}</p>
                                <p className="text-sm"><strong>Runner:</strong> {doc.runnerId}</p>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline">Cancel</Button>
                              <Button onClick={() => handleConfirmReceived(doc.id)}>
                                Confirm Receipt
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
