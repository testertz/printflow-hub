import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, DollarSign, CheckCircle, MapPin, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { COLLECTION_FEE } from '@/services/api';
import { PaymentGateway, PaymentMethod } from '@/components/PaymentGateway';

export default function UploadDocument() {
  const [step, setStep] = useState<'upload' | 'payment' | 'success'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [printType, setPrintType] = useState<'bw' | 'color'>('bw');
  const [deliveryType, setDeliveryType] = useState<'self-pickup' | 'delivery'>('delivery');
  const [location, setLocation] = useState('');
  const [pages, setPages] = useState(0);
  const [paymentReference, setPaymentReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BW_COST_PER_PAGE = 100; // TSH
  const COLOR_COST_PER_PAGE = 500; // TSH

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'application/rtf'
      ];
      
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        // Enhanced page count calculation based on file size
        // In production, this should be done on the backend with proper document parsing
        const fileSizeKB = selectedFile.size / 1024;
        let estimatedPages = 1;
        
        if (selectedFile.type === 'application/pdf') {
          // PDF: roughly 50-100KB per page
          estimatedPages = Math.max(1, Math.ceil(fileSizeKB / 75));
        } else if (selectedFile.type.includes('word') || selectedFile.type === 'application/rtf') {
          // Word/RTF: roughly 20-40KB per page
          estimatedPages = Math.max(1, Math.ceil(fileSizeKB / 30));
        } else if (selectedFile.type.includes('excel')) {
          // Excel: estimate based on file size
          estimatedPages = Math.max(1, Math.ceil(fileSizeKB / 50));
        } else if (selectedFile.type.includes('powerpoint')) {
          // PowerPoint: roughly 100-200KB per slide
          estimatedPages = Math.max(1, Math.ceil(fileSizeKB / 150));
        } else {
          // Text files: roughly 3-5KB per page
          estimatedPages = Math.max(1, Math.ceil(fileSizeKB / 4));
        }
        
        setPages(estimatedPages);
        toast.success(`Document loaded: approximately ${estimatedPages} page${estimatedPages > 1 ? 's' : ''}`);
      } else {
        toast.error('Please upload a valid document (PDF, Word, Excel, PowerPoint, or Text file). Images are not supported.');
      }
    }
  };

  const calculateCost = () => {
    const costPerPage = printType === 'color' ? COLOR_COST_PER_PAGE : BW_COST_PER_PAGE;
    return pages * costPerPage;
  };

  const totalAmount = calculateCost() + (deliveryType === 'delivery' ? COLLECTION_FEE : 0);

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    if (deliveryType === 'delivery' && !location.trim()) {
      toast.error('Please provide a collection location');
      return;
    }

    setStep('payment');
  };

  const handlePaymentComplete = (method: PaymentMethod, reference: string) => {
    setPaymentReference(reference);
    setIsSubmitting(true);

    // Simulate document submission
    setTimeout(() => {
      toast.success(`Payment successful! Document submitted.`);
      setStep('success');
      setIsSubmitting(false);
    }, 1500);
  };

  const handleNewUpload = () => {
    setFile(null);
    setPages(0);
    setPrintType('bw');
    setDeliveryType('delivery');
    setLocation('');
    setPaymentReference('');
    setStep('upload');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Document</h1>
        <p className="text-muted-foreground mt-2">Upload your document and pay to submit for printing</p>
      </div>

      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Document Details</CardTitle>
                <CardDescription>Fill in the details and upload your PDF file</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContinueToPayment} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="file">Document File</Label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                      {file && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span className="truncate max-w-[200px]">{file.name}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: PDF, Word, Excel, PowerPoint, Text files (Images not supported)
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label>Print Type</Label>
                    <RadioGroup value={printType} onValueChange={(value: any) => setPrintType(value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bw" id="bw" />
                        <Label htmlFor="bw" className="cursor-pointer font-normal">
                          Black & White ({BW_COST_PER_PAGE} TSH per page)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="color" id="color" />
                        <Label htmlFor="color" className="cursor-pointer font-normal">
                          Color ({COLOR_COST_PER_PAGE} TSH per page)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>Collection Method</Label>
                    <RadioGroup value={deliveryType} onValueChange={(value: any) => setDeliveryType(value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="self-pickup" id="self-pickup" />
                        <Label htmlFor="self-pickup" className="cursor-pointer font-normal flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Self Pickup from Stationary (No collection fee)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <Label htmlFor="delivery" className="cursor-pointer font-normal flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Print & Collect (Runner delivers to location - {COLLECTION_FEE} TSH fee)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {deliveryType === 'delivery' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="location">Collection Location *</Label>
                      <Input
                        id="location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Block A, Room 205 or Main Venue Hall"
                        className="w-full"
                        required={deliveryType === 'delivery'}
                      />
                      <p className="text-xs text-muted-foreground">
                        Specify the venue name, block, or room where you want your document collected
                      </p>
                    </motion.div>
                  )}

                  {file && pages > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4"
                    >
                      <Card className="bg-accent/50">
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Pages:</span>
                              <span className="font-semibold">{pages}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Print Cost:</span>
                              <span className="font-semibold">{calculateCost()} TSH</span>
                            </div>
                            {deliveryType === 'delivery' && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Collection Fee:</span>
                                <span className="font-semibold">{COLLECTION_FEE} TSH</span>
                              </div>
                            )}
                            <div className="border-t pt-3 flex justify-between items-center">
                              <span className="font-medium">Total Amount:</span>
                              <span className="text-xl sm:text-2xl font-bold text-primary">{totalAmount} TSH</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={!file}
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Continue to Payment
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PaymentGateway
              amount={totalAmount}
              onPaymentComplete={handlePaymentComplete}
              onCancel={() => setStep('upload')}
            />
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <div className="mx-auto w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-10 w-10 text-success" />
                    </div>
                  </motion.div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Payment Successful!</h3>
                    <p className="text-muted-foreground">
                      Your document has been submitted for printing
                    </p>
                  </div>

                  <Card className="bg-accent/50">
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between gap-1">
                        <span className="text-sm text-muted-foreground">Document:</span>
                        <span className="font-medium truncate">{file?.name}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between gap-1">
                        <span className="text-sm text-muted-foreground">Collection:</span>
                        <span className="font-medium">
                          {deliveryType === 'self-pickup' ? 'Self Pickup' : `Delivery to: ${location}`}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between gap-1">
                        <span className="text-sm text-muted-foreground">Payment Reference:</span>
                        <span className="font-mono text-sm break-all">{paymentReference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Amount Paid:</span>
                        <span className="font-bold text-primary">{totalAmount} TSH</span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={handleNewUpload} className="flex-1">
                      Upload Another Document
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = '/student/documents'} className="flex-1">
                      View My Documents
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
