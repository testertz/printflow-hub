import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

// Set the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface DocumentParseResult {
  pages: number;
  type: string;
  error?: string;
}

/**
 * Parse PDF and return exact page count
 */
async function parsePDF(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  return pdf.numPages;
}

/**
 * Parse DOCX and estimate pages based on content
 * Average page contains ~3000 characters or ~500 words
 */
async function parseDOCX(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value;
  const charCount = text.length;
  // ~3000 characters per page (standard formatting)
  return Math.max(1, Math.ceil(charCount / 3000));
}

/**
 * Parse Excel and count sheets (each sheet = 1 page when printed)
 */
async function parseXLSX(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  // Each sheet counts as at least 1 page
  // For more accuracy, we could estimate based on cell count
  let totalPages = 0;
  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
    const rows = range.e.r - range.s.r + 1;
    // Estimate ~50 rows per printed page
    totalPages += Math.max(1, Math.ceil(rows / 50));
  });
  return totalPages;
}

/**
 * Parse PowerPoint and count slides
 * PPTX files are ZIP archives containing XML files
 */
async function parsePPTX(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  
  // PPTX is actually a ZIP file, we can use JSZip to read it
  try {
    const JSZip = (await import('jszip')).default;
    const zip = await JSZip.loadAsync(arrayBuffer);
    
    // Count slide files (ppt/slides/slide1.xml, slide2.xml, etc.)
    let slideCount = 0;
    const slideRegex = /ppt\/slides\/slide\d+\.xml/;
    
    zip.forEach((relativePath) => {
      if (slideRegex.test(relativePath)) {
        slideCount++;
      }
    });
    
    return Math.max(1, slideCount);
  } catch {
    // Fallback: estimate based on file size (~150KB per slide)
    return Math.max(1, Math.ceil(file.size / (150 * 1024)));
  }
}

/**
 * Parse plain text and estimate pages
 * Standard page: ~3000 characters or ~60 lines
 */
async function parseTXT(file: File): Promise<number> {
  const text = await file.text();
  const charCount = text.length;
  const lineCount = text.split('\n').length;
  
  // Use both character count and line count for better accuracy
  const charPages = Math.ceil(charCount / 3000);
  const linePages = Math.ceil(lineCount / 60);
  
  // Take the maximum as the estimate
  return Math.max(1, Math.max(charPages, linePages));
}

/**
 * Parse RTF and estimate pages
 * RTF contains markup, so we strip it first
 */
async function parseRTF(file: File): Promise<number> {
  const text = await file.text();
  // Strip RTF control words and groups
  const plainText = text
    .replace(/\\[a-z]+\d*\s?/gi, '') // Remove control words
    .replace(/[{}]/g, '') // Remove braces
    .replace(/\\\\/g, '\\') // Unescape backslashes
    .replace(/\\'/g, "'"); // Unescape quotes
  
  const charCount = plainText.length;
  return Math.max(1, Math.ceil(charCount / 3000));
}

/**
 * Parse old DOC format (estimation based on file analysis)
 */
async function parseDOC(file: File): Promise<number> {
  // Old DOC format is complex binary format
  // We'll estimate based on file size (~30KB per page for formatted docs)
  const fileSizeKB = file.size / 1024;
  return Math.max(1, Math.ceil(fileSizeKB / 30));
}

/**
 * Parse old XLS format
 */
async function parseXLS(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  let totalPages = 0;
  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
    const rows = range.e.r - range.s.r + 1;
    totalPages += Math.max(1, Math.ceil(rows / 50));
  });
  return totalPages;
}

/**
 * Main function to parse any supported document and return page count
 */
export async function parseDocument(file: File): Promise<DocumentParseResult> {
  const mimeType = file.type;
  const extension = file.name.split('.').pop()?.toLowerCase();

  try {
    let pages = 1;
    let type = 'unknown';

    // PDF
    if (mimeType === 'application/pdf' || extension === 'pdf') {
      pages = await parsePDF(file);
      type = 'PDF';
    }
    // DOCX (modern Word)
    else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      extension === 'docx'
    ) {
      pages = await parseDOCX(file);
      type = 'Word Document';
    }
    // DOC (legacy Word)
    else if (mimeType === 'application/msword' || extension === 'doc') {
      pages = await parseDOC(file);
      type = 'Word Document (Legacy)';
    }
    // XLSX (modern Excel)
    else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      extension === 'xlsx'
    ) {
      pages = await parseXLSX(file);
      type = 'Excel Spreadsheet';
    }
    // XLS (legacy Excel)
    else if (mimeType === 'application/vnd.ms-excel' || extension === 'xls') {
      pages = await parseXLS(file);
      type = 'Excel Spreadsheet (Legacy)';
    }
    // PPTX (modern PowerPoint)
    else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      extension === 'pptx'
    ) {
      pages = await parsePPTX(file);
      type = 'PowerPoint Presentation';
    }
    // PPT (legacy PowerPoint)
    else if (mimeType === 'application/vnd.ms-powerpoint' || extension === 'ppt') {
      // Legacy PPT estimation
      pages = Math.max(1, Math.ceil(file.size / (150 * 1024)));
      type = 'PowerPoint Presentation (Legacy)';
    }
    // Plain text
    else if (mimeType === 'text/plain' || extension === 'txt') {
      pages = await parseTXT(file);
      type = 'Text File';
    }
    // RTF
    else if (mimeType === 'application/rtf' || extension === 'rtf') {
      pages = await parseRTF(file);
      type = 'Rich Text Document';
    }
    else {
      return {
        pages: 1,
        type: 'Unknown',
        error: 'Unsupported file format'
      };
    }

    return { pages, type };
  } catch (error) {
    console.error('Document parsing error:', error);
    return {
      pages: 1,
      type: 'Unknown',
      error: error instanceof Error ? error.message : 'Failed to parse document'
    };
  }
}
