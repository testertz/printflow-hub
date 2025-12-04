import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  disabled?: boolean;
  isParsing?: boolean;
  selectedFile?: File | null;
  onClearFile?: () => void;
  documentType?: string;
}

export function FileDropzone({
  onFileSelect,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf",
  disabled = false,
  isParsing = false,
  selectedFile = null,
  onClearFile,
  documentType
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const simulateProgress = useCallback(() => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 30;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      simulateProgress();
      onFileSelect(droppedFile);
    }
  }, [disabled, onFileSelect, simulateProgress]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateProgress();
      onFileSelect(file);
    }
  }, [onFileSelect, simulateProgress]);

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadProgress(0);
    if (onClearFile) {
      onClearFile();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onClearFile]);

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />
      
      <motion.div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 sm:p-8 transition-all cursor-pointer",
          "flex flex-col items-center justify-center gap-3 min-h-[180px]",
          isDragOver && "border-primary bg-primary/5 scale-[1.02]",
          !isDragOver && !selectedFile && "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50",
          selectedFile && "border-primary/50 bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        animate={{
          scale: isDragOver ? 1.02 : 1,
          borderColor: isDragOver ? 'hsl(var(--primary))' : undefined
        }}
        transition={{ duration: 0.2 }}
      >
        <AnimatePresence mode="wait">
          {isParsing ? (
            <motion.div
              key="parsing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-3"
            >
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Analyzing document...</p>
              <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(uploadProgress, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ) : selectedFile ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-3 w-full"
            >
              <div className="relative">
                <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-7 w-7 text-primary" />
                </div>
                <button
                  onClick={handleClear}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="text-center max-w-full px-4">
                <p className="font-medium text-sm sm:text-base truncate max-w-[250px] sm:max-w-full">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                  {documentType && (
                    <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded">
                      {documentType}
                    </span>
                  )}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Click or drop to replace
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-3"
            >
              <motion.div
                animate={{ y: isDragOver ? -5 : 0 }}
                transition={{ duration: 0.2 }}
                className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <Upload className="h-7 w-7 text-primary" />
              </motion.div>
              <div className="text-center">
                <p className="font-medium text-sm sm:text-base">
                  {isDragOver ? 'Drop your file here' : 'Drag & drop your document'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to browse
                </p>
              </div>
              <p className="text-xs text-muted-foreground text-center px-4">
                PDF, Word, Excel, PowerPoint, Text files (max 20MB)
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
