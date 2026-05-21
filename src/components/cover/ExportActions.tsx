import { RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer, ImageDown, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { useState } from 'react';

interface Props {
  previewRef: RefObject<HTMLDivElement>;
  fileName: string;
}

const capture = async (el: HTMLDivElement) =>
  html2canvas(el, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
  });

const ExportActions = ({ previewRef, fileName }: Props) => {
  const [busy, setBusy] = useState<'pdf' | 'png' | 'print' | null>(null);
  const safeName = fileName.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'cover';

  const downloadPdf = async () => {
    if (!previewRef.current) return;
    setBusy('pdf');
    try {
      const canvas = await capture(previewRef.current);
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
      const w = pdf.internal.pageSize.getWidth();
      const h = pdf.internal.pageSize.getHeight();
      pdf.addImage(img, 'PNG', 0, 0, w, h);
      pdf.save(`${safeName}.pdf`);
      toast.success('PDF downloaded');
    } catch (e) {
      toast.error('Failed to generate PDF');
    } finally {
      setBusy(null);
    }
  };

  const downloadPng = async () => {
    if (!previewRef.current) return;
    setBusy('png');
    try {
      const canvas = await capture(previewRef.current);
      const link = document.createElement('a');
      link.download = `${safeName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Image downloaded');
    } catch {
      toast.error('Failed to generate image');
    } finally {
      setBusy(null);
    }
  };

  const printCover = async () => {
    if (!previewRef.current) return;
    setBusy('print');
    try {
      const canvas = await capture(previewRef.current);
      const img = canvas.toDataURL('image/png');
      const w = window.open('', '_blank');
      if (!w) {
        toast.error('Popup blocked');
        return;
      }
      w.document.write(`
        <html><head><title>${safeName}</title>
        <style>
          @page { size: A4; margin: 0; }
          body { margin: 0; }
          img { width: 100%; height: auto; display: block; }
        </style></head>
        <body><img src="${img}" onload="window.print();window.close();" /></body></html>
      `);
      w.document.close();
    } catch {
      toast.error('Failed to print');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={downloadPdf} disabled={!!busy}>
        {busy === 'pdf' ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Download className="h-4 w-4 mr-1" />}
        PDF
      </Button>
      <Button variant="outline" onClick={downloadPng} disabled={!!busy}>
        {busy === 'png' ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <ImageDown className="h-4 w-4 mr-1" />}
        PNG
      </Button>
      <Button variant="outline" onClick={printCover} disabled={!!busy}>
        {busy === 'print' ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Printer className="h-4 w-4 mr-1" />}
        Print
      </Button>
    </div>
  );
};

export default ExportActions;
