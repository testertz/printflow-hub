import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

export default function UploadDocument() {
  const [file, setFile] = useState<File | null>(null);
  const [printType, setPrintType] = useState<'bw' | 'color'>('bw');
  const [pages, setPages] = useState(0);
  const [cost, setCost] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const BW_COST_PER_PAGE = 2;
  const COLOR_COST_PER_PAGE = 10;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      // Simulate page count extraction
      const mockPages = Math.floor(Math.random() * 50) + 1;
      setPages(mockPages);
      calculateCost(mockPages, printType);
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const calculateCost = (pageCount: number, type: 'bw' | 'color') => {
    const costPerPage = type === 'bw' ? BW_COST_PER_PAGE : COLOR_COST_PER_PAGE;
    setCost(pageCount * costPerPage);
  };

  const handlePrintTypeChange = (value: string) => {
    const type = value as 'bw' | 'color';
    setPrintType(type);
    if (pages > 0) {
      calculateCost(pages, type);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      toast.success('Document uploaded successfully!');
      setIsUploading(false);
      setFile(null);
      setPages(0);
      setCost(0);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Document</h1>
        <p className="text-muted-foreground mt-2">Upload your PDF documents for printing</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Document Details</CardTitle>
            <CardDescription>
              Select your file and printing preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file">Upload PDF File</Label>
                <div className="relative">
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                </div>
                {file && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Print Type */}
              <div className="space-y-3">
                <Label>Print Type</Label>
                <RadioGroup value={printType} onValueChange={handlePrintTypeChange}>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="bw" id="bw" />
                    <Label htmlFor="bw" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">Black & White</p>
                        <p className="text-sm text-muted-foreground">₹{BW_COST_PER_PAGE} per page</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="color" id="color" />
                    <Label htmlFor="color" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">Color</p>
                        <p className="text-sm text-muted-foreground">₹{COLOR_COST_PER_PAGE} per page</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Cost Summary */}
              {pages > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-info/10 border border-primary/20"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pages:</span>
                      <span className="font-medium">{pages}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Print Type:</span>
                      <span className="font-medium capitalize">{printType === 'bw' ? 'Black & White' : 'Color'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cost per page:</span>
                      <span className="font-medium">₹{printType === 'bw' ? BW_COST_PER_PAGE : COLOR_COST_PER_PAGE}</span>
                    </div>
                    <div className="h-px bg-border my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Cost:</span>
                      <span className="text-primary">₹{cost}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={!file || isUploading}>
                <Upload className="mr-2 h-5 w-5" />
                {isUploading ? 'Uploading...' : 'Upload & Submit'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
