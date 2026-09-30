export function printReceipt(order: any, pharmacy: any) {
  const printWindow = window.open('', '_blank', 'width=600,height=700');
  if (!printWindow) {
    alert('Please allow popups to print invoices');
    return;
  }

  const itemsHtml = (order.items || []).map((it: any, idx: number) => `
    <tr>
      <td style="padding: 6px 0; border-bottom: 1px dashed #e2e8f0;">
        <div style="font-weight: bold; color: #0f172a;">${it.name}</div>
        <div style="font-size: 11px; color: #64748b;">Batch: ${it.batch || 'N/A'}</div>
      </td>
      <td style="padding: 6px 0; text-align: center; border-bottom: 1px dashed #e2e8f0; font-weight: bold;">${it.quantity}</td>
      <td style="padding: 6px 0; text-align: right; border-bottom: 1px dashed #e2e8f0;">₹${it.price}.00</td>
      <td style="padding: 6px 0; text-align: right; border-bottom: 1px dashed #e2e8f0; font-weight: bold;">₹${it.total}.00</td>
    </tr>
  `).join('');

  const cashChangeRow = order.cashGiven && order.cashGiven > 0 ? `
    <div style="display: flex; justify-content: space-between; font-size: 12px; color: #475569; margin-top: 4px;">
      <span>Cash Tendered:</span>
      <span>₹${order.cashGiven}.00</span>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; color: #16a34a; margin-top: 2px;">
      <span>Change Returned:</span>
      <span>₹${order.cashChange || 0}.00</span>
    </div>
  ` : '';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice #${order.orderNumber} - ${pharmacy?.name || 'Mecora Medical'}</title>
        <style>
          @page { margin: 10mm; size: auto; }
          body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            color: #0f172a;
            background: #ffffff;
            font-size: 13px;
            line-height: 1.4;
          }
          .receipt-box {
            max-width: 480px;
            margin: 0 auto;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            padding: 24px;
          }
          .header {
            text-align: center;
            border-bottom: 2px dashed #94a3b8;
            padding-bottom: 16px;
            margin-bottom: 16px;
          }
          .header h1 {
            margin: 0 0 4px;
            font-size: 20px;
            text-transform: uppercase;
            color: #0284c7;
            letter-spacing: 1px;
          }
          .meta {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 12px;
            margin-bottom: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          th {
            text-align: left;
            border-bottom: 2px solid #0f172a;
            padding: 6px 0;
            font-size: 11px;
            text-transform: uppercase;
            color: #475569;
          }
          .totals {
            margin-top: 14px;
            border-top: 2px dashed #94a3b8;
            padding-top: 12px;
          }
          .grand-total {
            display: flex;
            justify-content: space-between;
            font-size: 18px;
            font-weight: 900;
            color: #0284c7;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #cbd5e1;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 12px;
            border-top: 1px dashed #cbd5e1;
            font-size: 11px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="receipt-box">
          <div class="header">
            <h1>${pharmacy?.name || 'MECORA MEDICAL PHARMACY'}</h1>
            <div style="font-size: 12px; color: #475569;">${pharmacy?.address || 'Healthcare Central Market'}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
              DL No: ${pharmacy?.drugLicenseNo || 'DL-2026-MED'} | GSTIN: ${pharmacy?.gstin || '07AAAAA0000A1Z5'}
            </div>
            <div style="font-size: 11px; font-weight: bold; color: #0284c7; margin-top: 6px; text-transform: uppercase;">
              TAX INVOICE / CASH MEMO
            </div>
          </div>

          <div class="meta">
            <div>
              <div><strong>Bill No:</strong> #${order.orderNumber}</div>
              <div><strong>Patient:</strong> ${order.customerName || 'Counter Patient'}</div>
              ${order.customerPhone ? `<div><strong>Phone:</strong> ${order.customerPhone}</div>` : ''}
            </div>
            <div style="text-align: right;">
              <div><strong>Date:</strong> ${order.dateString || new Date().toLocaleString()}</div>
              <div><strong>Cashier:</strong> ${order.cashierName || 'Harshit'}</div>
              <div><strong>Payment:</strong> <span style="background: #e0f2fe; color: #0284c7; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${order.paymentMethod}</span></div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item & Batch</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Rate</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #475569;">
              <span>Subtotal:</span>
              <span>₹${order.subtotal}.00</span>
            </div>
            ${order.gstAmount > 0 ? `
              <div style="display: flex; justify-content: space-between; font-size: 12px; color: #475569;">
                <span>GST (Estimated):</span>
                <span>₹${order.gstAmount}.00</span>
              </div>
            ` : ''}
            ${order.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; font-size: 12px; color: #dc2626;">
                <span>Discount Applied:</span>
                <span>-₹${order.discount}.00</span>
              </div>
            ` : ''}
            <div class="grand-total">
              <span>GRAND TOTAL:</span>
              <span>₹${order.grandTotal}.00</span>
            </div>
            ${cashChangeRow}
          </div>

          <div class="footer">
            <p style="margin: 0; font-weight: bold;">Thank you for visiting ${pharmacy?.name || 'Mecora Medical'}!</p>
            <p style="margin: 4px 0 0; font-size: 10px;">Prescription drugs sold under supervision of registered pharmacist.</p>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
