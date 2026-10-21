/**
 * High-reliability print utility for parking tickets and receipts.
 * Prints directly via an isolated iframe to bypass SPA layout clipping and overflow bugs.
 */
export const printElement = (elementId: string, title: string = 'VPMS Document') => {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  // Create temporary invisible iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  // Collect all application stylesheets (Tailwind, fonts)
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((tag) => tag.outerHTML)
    .join('\n');

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        ${styles}
        <style>
          @page {
            size: auto;
            margin: 12mm auto;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box;
          }
          html, body {
            background: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 16px !important;
            display: flex !important;
            justify-content: center !important;
            align-items: flex-start !important;
          }
          .isolated-ticket-card {
            width: 100% !important;
            max-width: 440px !important;
            background: #ffffff !important;
            border: 2px dashed #64748b !important;
            border-radius: 16px !important;
            padding: 24px !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        </style>
      </head>
      <body>
        <div class="isolated-ticket-card">
          ${element.innerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
    // Cleanup after print dialog completes
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 2000);
  }, 250);
};
