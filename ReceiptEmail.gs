/**
 * POS Management System - Receipt Generation and Email Delivery
 */

// ============================================================================
// RECEIPT GENERATION
// ============================================================================

/**
 * Generate HTML receipt for an order
 */
function generateReceipt(orderId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const orderSheet = ss.getSheetByName(SHEET_NAMES.CUSTOMER_ORDERS);
    const lineSheet = ss.getSheetByName(SHEET_NAMES.CUSTOMER_ORDER_LINES);
    const customerSheet = ss.getSheetByName(SHEET_NAMES.CUSTOMERS);
    const productSheet = ss.getSheetByName(SHEET_NAMES.PRODUCTS);
    
    // Get order data
    const orderData = orderSheet.getDataRange().getValues();
    let orderRow = null;
    let orderIndex = -1;
    
    for (let i = 1; i < orderData.length; i++) {
      if (orderData[i][0] === orderId) {
        orderRow = orderData[i];
        orderIndex = i;
        break;
      }
    }
    
    if (!orderRow) {
      return { success: false, error: 'Order not found' };
    }
    
    // Get customer data
    const customerData = customerSheet.getDataRange().getValues();
    let customerName = 'Walk-in Customer';
    let customerEmail = '';
    let customerPhone = '';
    let customerAddress = '';
    
    for (let i = 1; i < customerData.length; i++) {
      if (customerData[i][0] === orderRow[1]) {
        customerName = customerData[i][1];
        customerEmail = customerData[i][2];
        customerPhone = customerData[i][3];
        customerAddress = customerData[i][4];
        break;
      }
    }
    
    // Get order lines
    const lineData = lineSheet.getDataRange().getValues();
    const productData = productSheet.getDataRange().getValues();
    
    // Create product map
    const productMap = {};
    for (let i = 1; i < productData.length; i++) {
      productMap[productData[i][0]] = {
        nom: productData[i][1],
        description: productData[i][2]
      };
    }
    
    const orderLines = [];
    for (let i = 1; i < lineData.length; i++) {
      if (lineData[i][1] === orderId) {
        const productId = lineData[i][2];
        const product = productMap[productId] || {};
        
        orderLines.push({
          nom: product.nom || 'Unknown Product',
          quantite: lineData[i][3],
          prix_unitaire: lineData[i][4],
          total: lineData[i][3] * lineData[i][4]
        });
      }
    }
    
    // Generate HTML
    const html = createReceiptHTML({
      receiptNumber: orderId,
      date: formatDate(orderRow[3]),
      customerName: customerName,
      customerEmail: customerEmail,
      customerPhone: customerPhone,
      customerAddress: customerAddress,
      orderLines: orderLines,
      subtotal: orderRow[6],
      tax: orderRow[6] * CONFIG.TAX_RATE,
      total: orderRow[6] * (1 + CONFIG.TAX_RATE),
      paymentMethod: orderRow[5]
    });
    
    return { success: true, html: html, customerEmail: customerEmail };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Create receipt HTML template
 */
function createReceiptHTML(data) {
  let lineItemsHTML = '';
  data.orderLines.forEach(line => {
    lineItemsHTML += `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${line.nom}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${line.quantite}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(line.prix_unitaire)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">${formatCurrency(line.total)}</td>
      </tr>
    `;
  });
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Receipt #${data.receiptNumber}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #4285f4;
    }
    .company-name {
      font-size: 28px;
      font-weight: bold;
      color: #4285f4;
      margin-bottom: 5px;
    }
    .company-info {
      font-size: 14px;
      color: #666;
    }
    .receipt-title {
      font-size: 24px;
      font-weight: bold;
      margin: 20px 0;
      text-align: center;
      color: #333;
    }
    .info-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .info-block {
      flex: 1;
    }
    .info-label {
      font-weight: 600;
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
    }
    .info-value {
      font-size: 14px;
      margin-bottom: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th {
      background-color: #f8f9fa;
      padding: 12px 10px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #dee2e6;
      font-size: 14px;
    }
    td {
      font-size: 14px;
    }
    .totals {
      margin-left: auto;
      width: 300px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }
    .total-row.grand-total {
      border-top: 2px solid #333;
      font-size: 18px;
      font-weight: bold;
      padding-top: 12px;
      margin-top: 8px;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #dee2e6;
      font-size: 12px;
      color: #666;
    }
    .thank-you {
      font-size: 18px;
      font-weight: 600;
      color: #4285f4;
      margin-bottom: 10px;
    }
    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-name">${CONFIG.COMPANY_NAME}</div>
    <div class="company-info">
      ${CONFIG.COMPANY_ADDRESS}<br>
      Tel: ${CONFIG.COMPANY_PHONE} | Email: ${CONFIG.COMPANY_EMAIL}
    </div>
  </div>

  <div class="receipt-title">RECEIPT</div>

  <div class="info-section">
    <div class="info-block">
      <div class="info-label">Receipt Number</div>
      <div class="info-value">${data.receiptNumber}</div>
      <div class="info-label">Date</div>
      <div class="info-value">${data.date}</div>
      <div class="info-label">Payment Method</div>
      <div class="info-value">${data.paymentMethod.toUpperCase()}</div>
    </div>
    <div class="info-block" style="text-align: right;">
      <div class="info-label">Customer</div>
      <div class="info-value">${data.customerName}</div>
      ${data.customerPhone ? `<div class="info-value">${data.customerPhone}</div>` : ''}
      ${data.customerEmail ? `<div class="info-value">${data.customerEmail}</div>` : ''}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align: center; width: 80px;">Qty</th>
        <th style="text-align: right; width: 120px;">Unit Price</th>
        <th style="text-align: right; width: 120px;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${lineItemsHTML}
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row">
      <span>Subtotal:</span>
      <span>${formatCurrency(data.subtotal)}</span>
    </div>
    <div class="total-row">
      <span>Tax (${CONFIG.TAX_RATE * 100}%):</span>
      <span>${formatCurrency(data.tax)}</span>
    </div>
    <div class="total-row grand-total">
      <span>TOTAL:</span>
      <span>${formatCurrency(data.total)}</span>
    </div>
  </div>

  <div class="footer">
    <div class="thank-you">Thank You for Your Business!</div>
    <p>This is a computer-generated receipt and does not require a signature.</p>
    <p>For inquiries, please contact us at ${CONFIG.COMPANY_EMAIL} or ${CONFIG.COMPANY_PHONE}</p>
  </div>
</body>
</html>
  `;
  
  return html;
}

/**
 * Format currency
 */
function formatCurrency(amount) {
  return CONFIG.CURRENCY + ' ' + Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

// ============================================================================
// EMAIL DELIVERY
// ============================================================================

/**
 * Send receipt email to customer
 */
function sendReceiptEmail(orderId, userId) {
  try {
    // Generate receipt
    const receiptResult = generateReceipt(orderId);
    
    if (!receiptResult.success) {
      return receiptResult;
    }
    
    // Check if customer has email
    if (!receiptResult.customerEmail) {
      return { success: false, error: 'Customer email not available' };
    }
    
    // Send email
    const subject = `Receipt from ${CONFIG.COMPANY_NAME} - Order #${orderId}`;
    const htmlBody = receiptResult.html;
    
    try {
      MailApp.sendEmail({
        to: receiptResult.customerEmail,
        subject: subject,
        htmlBody: htmlBody,
        name: CONFIG.COMPANY_NAME
      });
      
      logAction(userId, 'SEND_RECEIPT', 'Sent receipt email for order: ' + orderId);
      return { success: true, message: 'Receipt sent to ' + receiptResult.customerEmail };
      
    } catch (emailError) {
      return { success: false, error: 'Failed to send email: ' + emailError.toString() };
    }
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Send receipt email with custom recipient
 */
function sendReceiptEmailToAddress(orderId, emailAddress, userId) {
  try {
    // Generate receipt
    const receiptResult = generateReceipt(orderId);
    
    if (!receiptResult.success) {
      return receiptResult;
    }
    
    // Send email
    const subject = `Receipt from ${CONFIG.COMPANY_NAME} - Order #${orderId}`;
    const htmlBody = receiptResult.html;
    
    try {
      MailApp.sendEmail({
        to: emailAddress,
        subject: subject,
        htmlBody: htmlBody,
        name: CONFIG.COMPANY_NAME
      });
      
      logAction(userId, 'SEND_RECEIPT', 'Sent receipt email for order: ' + orderId + ' to ' + emailAddress);
      return { success: true, message: 'Receipt sent to ' + emailAddress };
      
    } catch (emailError) {
      return { success: false, error: 'Failed to send email: ' + emailError.toString() };
    }
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Preview receipt (for testing)
 */
function previewReceipt(orderId) {
  const result = generateReceipt(orderId);
  if (result.success) {
    const html = HtmlService.createHtmlOutput(result.html)
      .setWidth(850)
      .setHeight(900);
    SpreadsheetApp.getUi().showModalDialog(html, 'Receipt Preview - Order #' + orderId);
  } else {
    SpreadsheetApp.getUi().alert('Error: ' + result.error);
  }
}
