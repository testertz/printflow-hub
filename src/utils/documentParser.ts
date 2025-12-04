import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';

export interface DocumentParseResult {
  pages: number;
  type: string;
  error?: string;
}

// PDF parsing using basic structure analysis (browser-compatible)
async function parsePDF(file: File): Promise<DocumentParseResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const text = new TextDecoder('latin1').decode(bytes);
    
    // Count page objects in PDF structure
    const pageMatches = text.match(/\/Type\s*\/Page[^s]/g);
    if (pageMatches && pageMatches.length > 0) {
      return { pages: pageMatches.length, type: 'PDF' };
    }
    
    // Alternative: look for /Count in page tree
    const countMatch = text.match(/\/Count\s+(\d+)/);
    if (countMatch) {
      return { pages: parseInt(countMatch[1], 10), type: 'PDF' };
    }
    
    // Fallback estimation
    const estimatedPages = Math.max(1, Math.ceil(file.size / 50000));
    return { pages: estimatedPages, type: 'PDF', error: 'Could not parse PDF structure' };
  } catch (error) {
    const estimatedPages = Math.max(1, Math.ceil(file.size / 50000));
    return { pages: estimatedPages, type: 'PDF', error: 'PDF parsing failed' };
  }
}

// DOCX parsing using mammoth
async function parseDOCX(file: File): Promise<DocumentParseResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value;
    
    // Estimate pages based on character count (approx 3000 chars per page)
    const charCount = text.length;
    const pages = Math.max(1, Math.ceil(charCount / 3000));
    
    return { pages, type: 'Word Document' };
  } catch (error) {
    const estimatedPages = Math.max(1, Math.ceil(file.size / 25000));
    return { pages: estimatedPages, type: 'Word Document', error: 'DOCX parsing failed' };
  }
}

// DOC parsing (older format - use estimation)
async function parseDOC(file: File): Promise<DocumentParseResult> {
  const estimatedPages = Math.max(1, Math.ceil(file.size / 25000));
  return { pages: estimatedPages, type: 'Word Document (Legacy)', error: 'Legacy DOC format - estimated' };
}

// Excel parsing
async function parseXLSX(file: File): Promise<DocumentParseResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    let totalRows = 0;
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
      totalRows += range.e.r - range.s.r + 1;
    });
    
    // Estimate pages (approx 50 rows per page)
    const pages = Math.max(1, Math.ceil(totalRows / 50));
    return { pages, type: 'Excel Spreadsheet' };
  } catch (error) {
    const estimatedPages = Math.max(1, Math.ceil(file.size / 30000));
    return { pages: estimatedPages, type: 'Excel Spreadsheet', error: 'Excel parsing failed' };
  }
}

// PowerPoint parsing
async function parsePPTX(file: File): Promise<DocumentParseResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    
    // Count slide files in ppt/slides/
    const slideFiles = Object.keys(zip.files).filter(name => 
      name.startsWith('ppt/slides/slide') && name.endsWith('.xml')
    );
    
    const pages = slideFiles.length || 1;
    return { pages, type: 'PowerPoint Presentation' };
  } catch (error) {
    const estimatedPages = Math.max(1, Math.ceil(file.size / 100000));
    return { pages: estimatedPages, type: 'PowerPoint Presentation', error: 'PPTX parsing failed' };
  }
}

// Text file parsing
async function parseTXT(file: File): Promise<DocumentParseResult> {
  try {
    const text = await file.text();
    const lines = text.split('\n').length;
    const pages = Math.max(1, Math.ceil(lines / 60)); // ~60 lines per page
    return { pages, type: 'Text File' };
  } catch (error) {
    return { pages: 1, type: 'Text File', error: 'Text parsing failed' };
  }
}

// RTF parsing
async function parseRTF(file: File): Promise<DocumentParseResult> {
  try {
    const text = await file.text();
    // Remove RTF control words for character count
    const plainText = text.replace(/\\[a-z]+\d*\s?|\{|\}/gi, '');
    const pages = Math.max(1, Math.ceil(plainText.length / 3000));
    return { pages, type: 'Rich Text Document' };
  } catch (error) {
    const estimatedPages = Math.max(1, Math.ceil(file.size / 25000));
    return { pages: estimatedPages, type: 'Rich Text Document', error: 'RTF parsing failed' };
  }
}

export async function parseDocument(file: File): Promise<DocumentParseResult> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return parsePDF(file);
    case 'docx':
      return parseDOCX(file);
    case 'doc':
      return parseDOC(file);
    case 'xlsx':
    case 'xls':
      return parseXLSX(file);
    case 'pptx':
    case 'ppt':
      return parsePPTX(file);
    case 'txt':
      return parseTXT(file);
    case 'rtf':
      return parseRTF(file);
    default:
      return { 
        pages: Math.max(1, Math.ceil(file.size / 50000)), 
        type: 'Document', 
        error: 'Unknown format' 
      };
  }
}
