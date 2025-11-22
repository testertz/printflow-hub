import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/StatusBadge';
import { mockDocuments } from '@/services/api';

export default function ClassDocuments() {
  const classDocs = mockDocuments.filter(d => d.className === 'Computer Science 101');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Class Documents</h1>
        <p className="text-muted-foreground mt-2">View all print jobs from your class</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Class Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-center">Pages</TableHead>
                    <TableHead className="text-center">Type</TableHead>
                    <TableHead className="text-center">Cost</TableHead>
                    <TableHead className="text-center">Payment</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classDocs.map((doc, index) => (
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
                      <TableCell className="text-center">
                        <span className="uppercase text-sm font-medium">{doc.printType}</span>
                      </TableCell>
                      <TableCell className="text-center font-medium">₹{doc.cost}</TableCell>
                      <TableCell className="text-center">
                        <StatusBadge status={doc.paymentStatus as any} />
                      </TableCell>
                      <TableCell className="text-center">
                        <StatusBadge status={doc.printStatus as any} />
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
