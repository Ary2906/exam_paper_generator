import html2pdf from 'html2pdf.js';

interface PDFOptions {
  filename?: string;
  margin?: number;
  image?: { type: 'jpeg' | 'png' | 'webp'; quality: number };
  html2canvas?: { scale: number };
  jsPDF?: { orientation: 'portrait' | 'landscape'; unit: string; format: string };
}

const DEFAULT_PDF_OPTIONS = {
  margin: 10,
  image: { type: 'jpeg' as const, quality: 0.98 },
  html2canvas: { scale: 2 },
  jsPDF: { orientation: 'portrait' as const, unit: 'mm', format: 'a4' },
};

export const exportPDFFromElement = (
  elementId: string,
  filename: string = 'document.pdf',
  options: PDFOptions = {}
) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    return;
  }

  const finalOptions = { ...DEFAULT_PDF_OPTIONS, filename, ...options };
  html2pdf().set(finalOptions).from(element).save();
};
