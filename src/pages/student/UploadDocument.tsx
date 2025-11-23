import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { COLLECTION_FEE } from '@/services/api';

export default function UploadDocument() {
  const [file, setFile] = useState<File | null>(null);
  const [printType, setPrintType] = useState<'bw' | 'color'>('bw');
  const [pages, setPages] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BW_COST_PER_PAGE = 100; // TSH
  const COLOR_COST_PER_PAGE = 500; // TSH

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      // Mock page count calculation
      const mockPages = Math.floor(Math.random() * 50) + 1;
      setPages(mockPages);
    } else {
      toast.error('Please upload a PDF file');
    }
  };

  const calculateCost = () => {
    const costPerPage = printType === 'color' ? COLOR_COST_PER_PAGE : BW_COST_PER_PAGE;
    return pages * costPerPage;
  };

  const totalAmount = calculateCost() + COLLECTION_FEE;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setIsSubmitting(true);

    // Simulate payment and submission
    setTimeout(() => {
      toast.success(`Payment of ${totalAmount} TSH successful! Document submitted.`);
      setFile(null);
      setPages(0);
      setPrintType('bw');
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Document</h1>
        <p className="text-muted-foreground mt-2">Upload your document and pay to submit for printing</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Document Details</CardTitle>
            <CardDescription>Fill in the details and upload your PDF file</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file">PDF File</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
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
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Collection Fee:</span>
                          <span className="font-semibold">{COLLECTION_FEE} TSH</span>
                        </div>
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
                disabled={!file || isSubmitting}
              >
                {isSubmitting ? (
                  <>Processing Payment...</>
                ) : (
                  <>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Pay {totalAmount} TSH & Submit
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
