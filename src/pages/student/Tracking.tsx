import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedTimeline, TimelineStep } from '@/components/AnimatedTimeline';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockDocuments } from '@/services/api';
import { useState } from 'react';

const getTimelineSteps = (status: string): TimelineStep[] => {
  const allSteps = [
    { label: 'Document Uploaded', status: 'completed' as const, timestamp: '2 hours ago' },
    { label: 'Payment Confirmed', status: 'completed' as const, timestamp: '1 hour ago' },
    { label: 'Printing in Progress', status: 'completed' as const, timestamp: '45 mins ago' },
    { label: 'Ready for Pickup', status: 'completed' as const, timestamp: '30 mins ago' },
    { label: 'Picked by Runner', status: 'active' as const, timestamp: 'In progress' },
    { label: 'Out for Delivery', status: 'pending' as const },
    { label: 'Delivered to Class Leader', status: 'pending' as const },
  ];

  const statusIndex = {
    'uploaded': 0,
    'paid': 1,
    'printing': 2,
    'ready': 3,
    'with_runner': 4,
    'delivered': 6,
    'completed': 6,
  }[status] || 0;

  return allSteps.map((step, index) => ({
    ...step,
    status: index < statusIndex ? 'completed' : 
            index === statusIndex ? 'active' : 'pending'
  }));
};

export default function Tracking() {
  const [selectedDocId, setSelectedDocId] = useState(mockDocuments[0].id);
  const selectedDoc = mockDocuments.find(doc => doc.id === selectedDocId) || mockDocuments[0];
  const steps = getTimelineSteps(selectedDoc.printStatus);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Track Order</h1>
        <p className="text-muted-foreground mt-2">Monitor the status of your print jobs in real-time</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Select Document</CardTitle>
            <CardDescription>Choose a document to track its progress</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedDocId} onValueChange={setSelectedDocId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockDocuments.slice(0, 5).map((doc) => (
                  <SelectItem key={doc.id} value={doc.id}>
                    {doc.fileName} - {doc.pages} pages
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>
              {selectedDoc.fileName} • {selectedDoc.pages} pages • ₹{selectedDoc.cost}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatedTimeline steps={steps} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-primary/5 to-info/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order ID:</span>
              <span className="font-medium">{selectedDoc.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Print Type:</span>
              <span className="font-medium uppercase">{selectedDoc.printType}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Assigned Runner:</span>
              <span className="font-medium">{selectedDoc.runnerId || 'Not assigned yet'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Class:</span>
              <span className="font-medium">{selectedDoc.className}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
