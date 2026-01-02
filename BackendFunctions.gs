/**
 * POS Management System - Backend Functions
 * Product, Supplier, Customer, User, and Order Management
 */

// ============================================================================
// USER AUTHENTICATION & MANAGEMENT
// ============================================================================

/**
 * Authenticate user
 */
function authenticateUser(email, password) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const userSheet = ss.getSheetByName(SHEET_NAMES.USERS);
    const data = userSheet.getDataRange().getValues();
    
    // Find user by email
    for (let i = 1; i < data.length; i++) {
      if (data[i][2] === email) { // email column
        const hashedPassword = data[i][3];
        
        // Verify password
        if (verifyPassword(password, hashedPassword)) {
          const user = {
            id: data[i][0],
            nom: data[i][1],
            email: data[i][2],
            role: data[i][4],
            statut: data[i][5]
          };
          
          // Check if user is active
          if (user.statut !== 'actif') {
            return { success: false, error: 'User account is not active' };
          }
          
          logAction(user.id, 'LOGIN', 'User logged in');
          return { success: true, user: user };
        } else {
          return { success: false, error: 'Invalid password' };
        }
      }
    }
    
    return { success: false, error: 'User not found' };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Check user permissions
 */
function checkPermissions(userId, requiredRole) {
  const user = getUserById(userId);
  if (!user) return false;
  
  const roleHierarchy = { 'admin': 3, 'gestionnaire': 2, 'vendeur': 1 };
  const requiredLevel = roleHierarchy[requiredRole] || 0;
  const userLevel = roleHierarchy[user.role] || 0;
  
  return userLevel >= requiredLevel;
}

/**
 * Get user by ID
 */
function getUserById(userId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const userSheet = ss.getSheetByName(SHEET_NAMES.USERS);
  const data = userSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      return {
        id: data[i][0],
        nom: data[i][1],
        email: data[i][2],
        role: data[i][4],
        statut: data[i][5],
        date_creation: data[i][6]
      };
    }
  }
  
  return null;
}

/**
 * Add new user
 */
function addUser(userData, currentUserId) {
  try {
    // Check if current user has admin permissions
    if (!checkPermissions(currentUserId, 'admin')) {
      return { success: false, error: 'Insufficient permissions' };
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const userSheet = ss.getSheetByName(SHEET_NAMES.USERS);
    
    // Check if email already exists
    const data = userSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][2] === userData.email) {
        return { success: false, error: 'Email already exists' };
      }
    }
    
    const userId = generateId('USER');
    const hashedPassword = hashPassword(userData.password);
    
    userSheet.appendRow([
      userId,
      userData.nom,
      userData.email,
      hashedPassword,
      userData.role,
      'actif',
      new Date()
    ]);
    
    logAction(currentUserId, 'ADD_USER', 'Added user: ' + userData.email);
    return { success: true, userId: userId };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Get all users
 */
function getUsers(currentUserId) {
  try {
    if (!checkPermissions(currentUserId, 'admin')) {
      return { success: false, error: 'Insufficient permissions' };
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const userSheet = ss.getSheetByName(SHEET_NAMES.USERS);
    const data = userSheet.getDataRange().getValues();
    
    const users = [];
    for (let i = 1; i < data.length; i++) {
      users.push({
        id: data[i][0],
        nom: data[i][1],
        email: data[i][2],
        role: data[i][4],
        statut: data[i][5],
        date_creation: formatDate(data[i][6])
      });
    }
    
    return { success: true, users: users };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ============================================================================
// PRODUCT MANAGEMENT
// ============================================================================

/**
 * Add new product
 */
function addProduct(productData, userId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const productSheet = ss.getSheetByName(SHEET_NAMES.PRODUCTS);
    const stockSheet = ss.getSheetByName(SHEET_NAMES.STOCK_ACTUAL);
    
    const productId = generateId('PROD');
    
    productSheet.appendRow([
      productId,
      productData.nom,
      productData.description || '',
      productData.categorie || '',
      productData.prix_achat,
      productData.prix_vente,
      'actif',
      new Date()
    ]);
    
    // Initialize stock
    stockSheet.appendRow([
      productId,
      productData.stock_initial || 0,
      productData.seuil_alerte || 10,
      new Date()
    ]);
    
    logAction(userId, 'ADD_PRODUCT', 'Added product: ' + productData.nom);
    return { success: true, productId: productId };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Update product
 */
function updateProduct(productId, productData, userId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const productSheet = ss.getSheetByName(SHEET_NAMES.PRODUCTS);
    const data = productSheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === productId) {
        productSheet.getRange(i + 1, 2).setValue(productData.nom);
        productSheet.getRange(i + 1, 3).setValue(productData.description || '');
        productSheet.getRange(i + 1, 4).setValue(productData.categorie || '');
        productSheet.getRange(i + 1, 5).setValue(productData.prix_achat);
        productSheet.getRange(i + 1, 6).setValue(productData.prix_vente);
        
        logAction(userId, 'UPDATE_PRODUCT', 'Updated product: ' + productId);
        return { success: true };
      }
    }
    
    return { success: false, error: 'Product not found' };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Delete product (soft delete - mark as inactive)
 */
function deleteProduct(productId, userId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const productSheet = ss.getSheetByName(SHEET_NAMES.PRODUCTS);
    const data = productSheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === productId) {
        productSheet.getRange(i + 1, 7).setValue('inactif');
        
        logAction(userId, 'DELETE_PRODUCT', 'Deleted product: ' + productId);
        return { success: true };
      }
    }
    
    return { success: false, error: 'Product not found' };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Get all products
 */
function getProducts() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const productSheet = ss.getSheetByName(SHEET_NAMES.PRODUCTS);
    const stockSheet = ss.getSheetByName(SHEET_NAMES.STOCK_ACTUAL);
    
    const productData = productSheet.getDataRange().getValues();
    const stockData = stockSheet.getDataRange().getValues();
    
    // Create stock map for quick lookup
    const stockMap = {};
    for (let i = 1; i < stockData.length; i++) {
      stockMap[stockData[i][0]] = {
        quantite: stockData[i][1],
        seuil_alerte: stockData[i][2]
      };
    }
    
    const products = [];
    for (let i = 1; i < productData.length; i++) {
      const productId = productData[i][0];
      const stock = stockMap[productId] || { quantite: 0, seuil_alerte: 0 };
      
      products.push({
        id: productId,
        nom: productData[i][1],
        description: productData[i][2],
        categorie: productData[i][3],
        prix_achat: productData[i][4],
        prix_vente: productData[i][5],
        statut: productData[i][6],
        stock_quantite: stock.quantite,
        stock_seuil: stock.seuil_alerte,
        date_creation: formatDate(productData[i][7])
      });
    }
    
    return { success: true, products: products };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Get product by ID
 */
function getProductById(productId) {
  const result = getProducts();
  if (result.success) {
    const product = result.products.find(p => p.id === productId);
    return product || null;
  }
  return null;
}

// ============================================================================
// SUPPLIER MANAGEMENT
// ============================================================================

/**
 * Add supplier
 */
function addSupplier(supplierData, userId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const supplierSheet = ss.getSheetByName(SHEET_NAMES.SUPPLIERS);
    
    const supplierId = generateId('SUPP');
    
    supplierSheet.appendRow([
      supplierId,
      supplierData.nom,
      supplierData.contact || '',
      supplierData.email || '',
      supplierData.telephone || '',
      supplierData.adresse || '',
      new Date()
    ]);
    
    logAction(userId, 'ADD_SUPPLIER', 'Added supplier: ' + supplierData.nom);
    return { success: true, supplierId: supplierId };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Get all suppliers
 */
function getSuppliers() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const supplierSheet = ss.getSheetByName(SHEET_NAMES.SUPPLIERS);
    const data = supplierSheet.getDataRange().getValues();
    
    const suppliers = [];
    for (let i = 1; i < data.length; i++) {
      suppliers.push({
        id: data[i][0],
        nom: data[i][1],
        contact: data[i][2],
        email: data[i][3],
        telephone: data[i][4],
        adresse: data[i][5],
        date_creation: formatDate(data[i][6])
      });
    }
    
    return { success: true, suppliers: suppliers };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Update supplier
 */
function updateSupplier(supplierId, supplierData, userId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const supplierSheet = ss.getSheetByName(SHEET_NAMES.SUPPLIERS);
    const data = supplierSheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === supplierId) {
        supplierSheet.getRange(i + 1, 2).setValue(supplierData.nom);
        supplierSheet.getRange(i + 1, 3).setValue(supplierData.contact || '');
        supplierSheet.getRange(i + 1, 4).setValue(supplierData.email || '');
        supplierSheet.getRange(i + 1, 5).setValue(supplierData.telephone || '');
        supplierSheet.getRange(i + 1, 6).setValue(supplierData.adresse || '');
        
        logAction(userId, 'UPDATE_SUPPLIER', 'Updated supplier: ' + supplierId);
        return { success: true };
      }
    }
    
    return { success: false, error: 'Supplier not found' };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ============================================================================
// CUSTOMER MANAGEMENT
// ============================================================================

/**
 * Add customer
 */
function addCustomer(customerData, userId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const customerSheet = ss.getSheetByName(SHEET_NAMES.CUSTOMERS);
    
    const customerId = generateId('CUST');
    
    customerSheet.appendRow([
      customerId,
      customerData.nom,
      customerData.email || '',
      customerData.telephone || '',
      customerData.adresse || '',
      customerData.type || 'particulier',
      new Date()
    ]);
    
    logAction(userId, 'ADD_CUSTOMER', 'Added customer: ' + customerData.nom);
    return { success: true, customerId: customerId };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Get all customers
 */
function getCustomers() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const customerSheet = ss.getSheetByName(SHEET_NAMES.CUSTOMERS);
    const data = customerSheet.getDataRange().getValues();
    
    const customers = [];
    for (let i = 1; i < data.length; i++) {
      customers.push({
        id: data[i][0],
        nom: data[i][1],
        email: data[i][2],
        telephone: data[i][3],
        adresse: data[i][4],
        type: data[i][5],
        date_inscription: formatDate(data[i][6])
      });
    }
    
    return { success: true, customers: customers };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Update customer
 */
function updateCustomer(customerId, customerData, userId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const customerSheet = ss.getSheetByName(SHEET_NAMES.CUSTOMERS);
    const data = customerSheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === customerId) {
        customerSheet.getRange(i + 1, 2).setValue(customerData.nom);
        customerSheet.getRange(i + 1, 3).setValue(customerData.email || '');
        customerSheet.getRange(i + 1, 4).setValue(customerData.telephone || '');
        customerSheet.getRange(i + 1, 5).setValue(customerData.adresse || '');
        customerSheet.getRange(i + 1, 6).setValue(customerData.type || 'particulier');
        
        logAction(userId, 'UPDATE_CUSTOMER', 'Updated customer: ' + customerId);
        return { success: true };
      }
    }
    
    return { success: false, error: 'Customer not found' };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}
