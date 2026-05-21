'use client';

export async function shareInvoicePDF(invoiceNumber: string): Promise<void> {
  const element = document.getElementById('nakladnaya-doc');
  if (!element) throw new Error('Элемент документа не найден');

  // Fonts must be loaded before capture
  await document.fonts.ready;

  const [html2canvasModule, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);
  const html2canvas = html2canvasModule.default;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    removeContainer: true,
  });

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const ratio = canvas.height / canvas.width;
  const imgH = pageW * ratio;

  // Multi-page support if content overflows A4
  if (imgH <= pageH) {
    pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, pageW, imgH);
  } else {
    let y = 0;
    while (y < imgH) {
      if (y > 0) pdf.addPage();
      // Crop the canvas for each page
      const srcY = (y / imgH) * canvas.height;
      const srcH = Math.min((pageH / imgH) * canvas.height, canvas.height - srcY);
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = srcH;
      const ctx = pageCanvas.getContext('2d')!;
      ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
      pdf.addImage(pageCanvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, pageW, pageH);
      y += pageH;
    }
  }

  const filename = `накладная-${invoiceNumber}.pdf`;
  const blob = pdf.output('blob');
  const file = new File([blob], filename, { type: 'application/pdf' });

  // Try Web Share API (works on mobile Chrome/Safari)
  if (
    typeof navigator !== 'undefined' &&
    navigator.share &&
    navigator.canShare?.({ files: [file] })
  ) {
    await navigator.share({ title: `Накладная № ${invoiceNumber}`, files: [file] });
  } else {
    // Fallback: download the PDF
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
}
