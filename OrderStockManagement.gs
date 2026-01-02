/**
 * POS Management System - Order and Stock Management
 * Supplier Orders, Customer Orders, Stock Movements, and Sales
 */

// ============================================================================
// STOCK MANAGEMENT
// ============================================================================

/**
 * Update stock quantity
 */
function updateStock(productId, quantity, type, reference, description, userId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const stockSheet = ss.getSheetByName(SHEET_NAMES.STOCK_ACTUAL);
    const movementSheet = ss.getSheetByName(SHEET_NAMES.STOCK_MOVEMENTS);
    
    const data = stockSheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === productId) {
        const currentQty = data[i][1];
        let newQty = currentQty;
        
        if (type === 'entrée') {
          newQty = currentQty + quantity;
        } else if (type === 'sortie') {
          newQty = currentQty - quantity;
          if (newQty < 0) {
            return { success: false, error: 'Insufficient stock' };
          }
        }
        
        // Update stock
        stockSheet.getRange(i + 1, 2).setValue(newQty);
        stockSheet.getRange(i + 1, 4).setValue(new Date());
        
        // Record movement
        recordMovement(productId, type, quantity, reference, description);
        
        logAction(userId, 'UPDATE_STOCK', 'Stock updated for product: ' + productId);
        return { success: true, newQuantity: newQty };
      }
    }
    
    return { success: false, error: 'Product not found in stock' };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Record stock movement
 */
function recordMovement(productId, type, quantity, reference, description) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const movementSheet = ss.getSheetByName(SHEET_NAMES.STOCK_MOVEMENTS);
  
  movementSheet.appendRow([
    generateId('MOV'),
    productId,
    type,
    quantity,
    new Date(),
    reference || '',
    description || ''
  ]);
}

/**
 * Get current stock
 */
function getStock() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const stockSheet = ss.getSheetByName(SHEET_NAMES.STOCK_ACTUAL);
    const productSheet = ss.getSheetByName(SHEET_NAMES.PRODUCTS);
    
    const stockData = stockSheet.getDataRange().getValues();
    const productData = productSheet.getDataRange().getValues();
    
    // Create product map
    const productMap = {};
    for (let i = 1; i < productData.length; i++) {
      productMap[productData[i][0]] = {
        nom: productData[i][1],
        categorie: productData[i][3],
        prix_vente: productData[i][5]
      };
    }
    
    const stock = [];
    for (let i = 1; i < stockData.length; i++) {
      const productId = stockData[i][0];
      const product = productMap[productId] || {};
      
      stock.push({
        id_produit: productId,
        nom_produit: product.nom || 'Unknown',
        categorie: product.categorie || '',
        quantite: stockData[i][1],
        seuil_alerte: stockData[i][2],
        dernier_mouvement: formatDate(stockData[i][3]),
        prix_vente: product.prix_vente || 0,
        is_low_stock: stockData[i][1] <= stockData[i][2]
      });
    }
    
    return { success: true, stock: stock };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Check low stock items
 */
function checkLowStock() {
  const result = getStock();
  if (result.success) {
    const lowStockItems = result.stock.filter(item => item.is_low_stock);
    return { success: true, lowStockItems: lowStockItems, count: lowStockItems.length };
  }
  return { success: false, error: 'Error checking stock' };
}

/**
 * Get stock movements history
 */
function getStockMovements(productId, limit) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const movementSheet = ss.getSheetByName(SHEET_NAMES.STOCK_MOVEMENTS);
    const data = movementSheet.getDataRange().getValues();
    
    const movements = [];
    for (let i = data.length - 1; i > 0 && movements.length < (limit || 100); i--) {
      if (!productId || data[i][1] === productId) {
        movements.push({
          id: data[i][0],
          id_produit: data[i][1],
          type: data[i][2],
          quantite: data[i][3],
          date: formatDate(data[i][4]),
          reference: data[i][5],
          description: data[i][6]
        });
      }
    }
    
    return { success: true, movements: movements };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ============================================================================
// SUPPLIER ORDER MANAGEMENT
// ============================================================================

/**
 * Create supplier order
 */
function createSupplierOrder(orderData, userId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const orderSheet = ss.getSheetByName(SHEET_NAMES.SUPPLIER_ORDERS);
    const lineSheet = ss.getSheetByName(SHEET_NAMES.SUPPLIER_ORDER_LINES);
    
    const orderId = generateId('SO');
    
    // Calculate total
    let total = 0;
    orderData.lines.forEach(line => {
      total += line.quantite * line.prix_unitaire;
    });
    
    // Create order
    orderSheet.appendRow([
      orderId,
      orderData.id_fournisseur,
      new Date(),
      '', // date_reception (empty until received)
      'en attente',
      total
    ]);
    
    // Create order lines
    orderData.lines.forEach(line => {
      lineSheet.appendRow([
        generateId('SOL'),
        orderId,
        line.id_produit,
        line.quantite,
        line.prix_unitaire
      ]);
    });
    
    logAction(userId, 'CREATE_SUPPLIER_ORDER', 'Created supplier order: ' + orderId);
    return { success: true, orderId: orderId, total: total };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Receive supplier order - updates stock
 */
function receiveSupplierOrder(orderId, userId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const orderSheet = ss.getSheetByName(SHEET_NAMES.SUPPLIER_ORDERS);
    const lineSheet = ss.getSheetByName(SHEET_NAMES.SUPPLIER_ORDER_LINES);
    
    const orderData = orderSheet.getDataRange().getValues();
    const lineData = lineSheet.getDataRange().getValues();
    
    // Find order
    let orderRowIndex = -1;
    for (let i = 1; i < orderData.length; i++) {
      if (orderData[i][0] === orderId) {
        orderRowIndex = i;
        break;
      }
    }
    
    if (orderRowIndex === -1) {
      return { success: false, error: 'Order not found' };
    }
    
    if (orderData[orderRowIndex][4] === 'reçue') {
      return { success: false, error: 'Order already received' };
    }
    
    // Update stock for each line
    for (let i = 1; i < lineData.length; i++) {
      if (lineData[i][1] === orderId) {
        const productId = lineData[i][2];
        const quantity = lineData[i][3];
        
        updateStock(productId, quantity, 'entrée', orderId, 'Réception commande fournisseur', userId);
      }
    }
    
    // Update order status
    orderSheet.getRange(orderRowIndex + 1, 4).setValue(new Date()); // date_reception
    orderSheet.getRange(orderRowIndex + 1, 5).setValue('reçue'); // statut
    
    logAction(userId, 'RECEIVE_SUPPLIER_ORDER', 'Received supplier order: ' + orderId);
    return { success: true };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Cancel supplier order
 */
function cancelSupplierOrder(orderId, userId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const orderSheet = ss.getSheetByName(SHEET_NAMES.SUPPLIER_ORDERS);
    const data = orderSheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === orderId) {
        if (data[i][4] === 'reçue') {
          return { success: false, error: 'Cannot cancel received order' };
        }
        
        orderSheet.getRange(i + 1, 5).setValue('annulée');
        logAction(userId, 'CANCEL_SUPPLIER_ORDER', 'Cancelled supplier order: ' + orderId);
        return { success: true };
      }
    }
    
    return { success: false, error: 'Order not found' };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Get supplier orders
 */
function getSupplierOrders() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const orderSheet = ss.getSheetByName(SHEET_NAMES.SUPPLIER_ORDERS);
    const supplierSheet = ss.getSheetByName(SHEET_NAMES.SUPPLIERS);
    
    const orderData = orderSheet.getDataRange().getValues();
    const supplierData = supplierSheet.getDataRange().getValues();
    
    // Create supplier map
    const supplierMap = {};
    for (let i = 1; i < supplierData.length; i++) {
      supplierMap[supplierData[i][0]] = supplierData[i][1]; // nom
    }
    
    const orders = [];
    for (let i = 1; i < orderData.length; i++) {
      orders.push({
        id: orderData[i][0],
        id_fournisseur: orderData[i][1],
        nom_fournisseur: supplierMap[orderData[i][1]] || 'Unknown',
        date_commande: formatDate(orderData[i][2]),
        date_reception: formatDate(orderData[i][3]),
        statut: orderData[i][4],
        montant_total: orderData[i][5]
      });
    }
    
    return { success: true, orders: orders };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ============================================================================
// CUSTOMER ORDER MANAGEMENT
// ============================================================================

/**
 * Create customer order (from POS)
 */
function createCustomerOrder(orderData, userId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const orderSheet = ss.getSheetByName(SHEET_NAMES.CUSTOMER_ORDERS);
    const lineSheet = ss.getSheetByName(SHEET_NAMES.CUSTOMER_ORDER_LINES);
    
    const orderId = generateId('CO');
    
    // Verify stock availability for all items
    for (let line of orderData.lines) {
      const product = getProductById(line.id_produit);
      if (!product) {
        return { success: false, error: 'Product not found: ' + line.id_produit };
      }
      if (product.stock_quantite < line.quantite) {
        return { success: false, error: 'Insufficient stock for: ' + product.nom };
      }
    }
    
    // Calculate total
    let total = 0;
    orderData.lines.forEach(line => {
      total += line.quantite * line.prix_unitaire;
    });
    
    // Apply discount
    if (orderData.remise) {
      total -= orderData.remise;
    }
    
    // Create order
    orderSheet.appendRow([
      orderId,
      orderData.id_client || '',
      userId,
      new Date(),
      'en cours',
      orderData.mode_paiement || 'cash',
      total
    ]);
    
    // Create order lines
    orderData.lines.forEach(line => {
      lineSheet.appendRow([
        generateId('COL'),
        orderId,
        line.id_produit,
        line.quantite,
        line.prix_unitaire
      ]);
    });
    
    logAction(userId, 'CREATE_CUSTOMER_ORDER', 'Created customer order: ' + orderId);
    return { success: true, orderId: orderId, total: total };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Validate customer order - deducts stock and creates sale
 */
function validateCustomerOrder(orderId, userId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const orderSheet = ss.getSheetByName(SHEET_NAMES.CUSTOMER_ORDERS);
    const lineSheet = ss.getSheetByName(SHEET_NAMES.CUSTOMER_ORDER_LINES);
    
    const orderData = orderSheet.getDataRange().getValues();
    const lineData = lineSheet.getDataRange().getValues();
    
    // Find order
    let orderRowIndex = -1;
    let orderRow = null;
    for (let i = 1; i < orderData.length; i++) {
      if (orderData[i][0] === orderId) {
        orderRowIndex = i;
        orderRow = orderData[i];
        break;
      }
    }
    
    if (orderRowIndex === -1) {
      return { success: false, error: 'Order not found' };
    }
    
    if (orderRow[4] === 'validée') {
      return { success: false, error: 'Order already validated' };
    }
    
    // Update stock for each line and calculate profit
    let totalProfit = 0;
    for (let i = 1; i < lineData.length; i++) {
      if (lineData[i][1] === orderId) {
        const productId = lineData[i][2];
        const quantity = lineData[i][3];
        const prixVente = lineData[i][4];
        
        // Get product info
        const product = getProductById(productId);
        if (product) {
          const profit = (prixVente - product.prix_achat) * quantity;
          totalProfit += profit;
        }
        
        // Deduct stock
        const stockResult = updateStock(productId, quantity, 'sortie', orderId, 'Vente client', userId);
        if (!stockResult.success) {
          return stockResult;
        }
      }
    }
    
    // Update order status
    orderSheet.getRange(orderRowIndex + 1, 5).setValue('validée');
    
    // Create sale record
    const saleResult = createSale({
      id_commande_c: orderId,
      montant: orderRow[6],
      remise: 0,
      benefice: totalProfit
    }, userId);
    
    logAction(userId, 'VALIDATE_CUSTOMER_ORDER', 'Validated customer order: ' + orderId);
    return { success: true, saleId: saleResult.saleId };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Get customer orders
 */
function getCustomerOrders() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const orderSheet = ss.getSheetByName(SHEET_NAMES.CUSTOMER_ORDERS);
    const customerSheet = ss.getSheetByName(SHEET_NAMES.CUSTOMERS);
    
    const orderData = orderSheet.getDataRange().getValues();
    const customerData = customerSheet.getDataRange().getValues();
    
    // Create customer map
    const customerMap = {};
    for (let i = 1; i < customerData.length; i++) {
      customerMap[customerData[i][0]] = customerData[i][1]; // nom
    }
    
    const orders = [];
    for (let i = 1; i < orderData.length; i++) {
      orders.push({
        id: orderData[i][0],
        id_client: orderData[i][1],
        nom_client: customerMap[orderData[i][1]] || 'Walk-in Customer',
        id_user: orderData[i][2],
        date_commande: formatDate(orderData[i][3]),
        statut: orderData[i][4],
        mode_paiement: orderData[i][5],
        montant_total: orderData[i][6]
      });
    }
    
    return { success: true, orders: orders };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ============================================================================
// SALES MANAGEMENT
// ============================================================================

/**
 * Create sale record
 */
function createSale(saleData, userId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const salesSheet = ss.getSheetByName(SHEET_NAMES.SALES);
    
    const saleId = generateId('SALE');
    
    salesSheet.appendRow([
      saleId,
      saleData.id_commande_c,
      new Date(),
      saleData.montant,
      saleData.remise || 0,
      saleData.benefice || 0,
      userId
    ]);
    
    logAction(userId, 'CREATE_SALE', 'Created sale: ' + saleId);
    return { success: true, saleId: saleId };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Get sales report
 */
function getSalesReport(startDate, endDate) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const salesSheet = ss.getSheetByName(SHEET_NAMES.SALES);
    const data = salesSheet.getDataRange().getValues();
    
    let totalSales = 0;
    let totalProfit = 0;
    let transactionCount = 0;
    const sales = [];
    
    for (let i = 1; i < data.length; i++) {
      const saleDate = new Date(data[i][2]);
      
      // Filter by date range if provided
      if (startDate && saleDate < new Date(startDate)) continue;
      if (endDate && saleDate > new Date(endDate)) continue;
      
      const montant = data[i][3];
      const remise = data[i][4];
      const benefice = data[i][5];
      
      totalSales += montant;
      totalProfit += benefice;
      transactionCount++;
      
      sales.push({
        id: data[i][0],
        id_commande: data[i][1],
        date: formatDate(data[i][2]),
        montant: montant,
        remise: remise,
        benefice: benefice,
        id_user: data[i][6]
      });
    }
    
    return {
      success: true,
      summary: {
        total_sales: totalSales,
        total_profit: totalProfit,
        transaction_count: transactionCount,
        average_sale: transactionCount > 0 ? totalSales / transactionCount : 0
      },
      sales: sales
    };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}
