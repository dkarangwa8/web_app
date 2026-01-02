/**
 * POS Management System - Google Apps Script Backend
 * Main configuration and initialization script
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  ADMIN_EMAIL: 'dkarangwa@gmail.com',
  DEFAULT_PASSWORD: 'admin123',
  COMPANY_NAME: 'POS Management System',
  COMPANY_EMAIL: 'dkarangwa@gmail.com',
  COMPANY_PHONE: '+250 XXX XXX XXX',
  COMPANY_ADDRESS: 'Kigali, Rwanda',
  TAX_RATE: 0.18, // 18% VAT
  CURRENCY: 'RWF'
};

const SHEET_NAMES = {
  PRODUCTS: 'produits',
  SUPPLIERS: 'fournisseurs',
  CUSTOMERS: 'clients',
  USERS: 'utilisateurs',
  SUPPLIER_ORDERS: 'commandes_fournisseurs',
  SUPPLIER_ORDER_LINES: 'lignes_cf',
  CUSTOMER_ORDERS: 'commandes_clients',
  CUSTOMER_ORDER_LINES: 'lignes_cc',
  STOCK_MOVEMENTS: 'stock_mouvements',
  STOCK_ACTUAL: 'stock_actuel',
  SALES: 'ventes',
  LOGS: 'logs'
};

// ============================================================================
// SYSTEM INITIALIZATION
// ============================================================================

/**
 * Initialize the entire system - creates all worksheets and default data
 */
function initializeSystem() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    // Create all worksheets
    createAllWorksheets(ss);
    
    // Add default admin user
    createDefaultAdminUser();
    
    // Add sample data (optional)
    addSampleData();
    
    SpreadsheetApp.getUi().alert(
      'System Initialized Successfully!\\n\\n' +
      'Default Admin Credentials:\\n' +
      'Email: ' + CONFIG.ADMIN_EMAIL + '\\n' +
      'Password: ' + CONFIG.DEFAULT_PASSWORD + '\\n\\n' +
      'Please change the password after first login.'
    );
    
    logAction('SYSTEM', 'System initialized successfully');
    
  } catch (error) {
    Logger.log('Initialization error: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error initializing system: ' + error.toString());
  }
}

/**
 * Create all required worksheets with headers
 */
function createAllWorksheets(ss) {
  // Products sheet
  createSheet(ss, SHEET_NAMES.PRODUCTS, [
    'id_produit', 'nom', 'description', 'catégorie', 'prix_achat', 
    'prix_vente', 'statut', 'date_creation'
  ]);
  
  // Suppliers sheet
  createSheet(ss, SHEET_NAMES.SUPPLIERS, [
    'id_fournisseur', 'nom', 'contact', 'email', 'téléphone', 
    'adresse', 'date_creation'
  ]);
  
  // Customers sheet
  createSheet(ss, SHEET_NAMES.CUSTOMERS, [
    'id_client', 'nom', 'email', 'téléphone', 'adresse', 
    'type', 'date_inscription'
  ]);
  
  // Users sheet
  createSheet(ss, SHEET_NAMES.USERS, [
    'id_user', 'nom', 'email', 'password', 'rôle', 
    'statut', 'date_creation'
  ]);
  
  // Supplier Orders sheet
  createSheet(ss, SHEET_NAMES.SUPPLIER_ORDERS, [
    'id_commande_f', 'id_fournisseur', 'date_commande', 'date_reception', 
    'statut', 'montant_total'
  ]);
  
  // Supplier Order Lines sheet
  createSheet(ss, SHEET_NAMES.SUPPLIER_ORDER_LINES, [
    'id_ligne_cf', 'id_commande_f', 'id_produit', 'quantité', 
    'prix_unitaire'
  ]);
  
  // Customer Orders sheet
  createSheet(ss, SHEET_NAMES.CUSTOMER_ORDERS, [
    'id_commande_c', 'id_client', 'id_user', 'date_commande', 
    'statut', 'mode_paiement', 'montant_total'
  ]);
  
  // Customer Order Lines sheet
  createSheet(ss, SHEET_NAMES.CUSTOMER_ORDER_LINES, [
    'id_ligne_cc', 'id_commande_c', 'id_produit', 'quantité', 
    'prix_unitaire'
  ]);
  
  // Stock Movements sheet
  createSheet(ss, SHEET_NAMES.STOCK_MOVEMENTS, [
    'id_mouvement', 'id_produit', 'type', 'quantité', 
    'date', 'id_reference', 'description'
  ]);
  
  // Stock Actual sheet
  createSheet(ss, SHEET_NAMES.STOCK_ACTUAL, [
    'id_produit', 'quantité', 'seuil_alerte', 'dernier_mouvement'
  ]);
  
  // Sales sheet
  createSheet(ss, SHEET_NAMES.SALES, [
    'id_vente', 'id_commande_c', 'date_vente', 'montant', 
    'remise', 'bénéfice', 'id_user'
  ]);
  
  // Logs sheet
  createSheet(ss, SHEET_NAMES.LOGS, [
    'id_log', 'date', 'id_user', 'action', 'description'
  ]);
  
  Logger.log('All worksheets created successfully');
}

/**
 * Create a single sheet with headers
 */
function createSheet(ss, sheetName, headers) {
  // Check if sheet already exists
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    // Create new sheet
    sheet = ss.insertSheet(sheetName);
    Logger.log('Created sheet: ' + sheetName);
  } else {
    // Clear existing content
    sheet.clear();
    Logger.log('Cleared existing sheet: ' + sheetName);
  }
  
  // Set headers
  if (headers && headers.length > 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    
    // Freeze header row
    sheet.setFrozenRows(1);
    
    // Auto-resize columns
    for (let i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }
  
  return sheet;
}

/**
 * Create default admin user
 */
function createDefaultAdminUser() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const userSheet = ss.getSheetByName(SHEET_NAMES.USERS);
  
  // Check if admin already exists
  const data = userSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === CONFIG.ADMIN_EMAIL) { // email column
      Logger.log('Admin user already exists');
      return;
    }
  }
  
  // Create admin user
  const userId = generateId('USER');
  const hashedPassword = hashPassword(CONFIG.DEFAULT_PASSWORD);
  
  userSheet.appendRow([
    userId,
    'Administrator',
    CONFIG.ADMIN_EMAIL,
    hashedPassword,
    'admin',
    'actif',
    new Date()
  ]);
  
  Logger.log('Default admin user created: ' + CONFIG.ADMIN_EMAIL);
}

/**
 * Add sample data for testing (optional)
 */
function addSampleData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Sample products
  const productSheet = ss.getSheetByName(SHEET_NAMES.PRODUCTS);
  const sampleProducts = [
    [generateId('PROD'), 'Coca-Cola 500ml', 'Boisson gazeuse', 'Boissons', 300, 500, 'actif', new Date()],
    [generateId('PROD'), 'Pain blanc', 'Pain frais', 'Boulangerie', 200, 400, 'actif', new Date()],
    [generateId('PROD'), 'Lait 1L', 'Lait frais', 'Produits laitiers', 800, 1200, 'actif', new Date()],
    [generateId('PROD'), 'Riz 1kg', 'Riz blanc', 'Épicerie', 1000, 1500, 'actif', new Date()],
    [generateId('PROD'), 'Sucre 1kg', 'Sucre blanc', 'Épicerie', 1200, 1800, 'actif', new Date()]
  ];
  
  sampleProducts.forEach(product => {
    productSheet.appendRow(product);
    
    // Initialize stock for each product
    const stockSheet = ss.getSheetByName(SHEET_NAMES.STOCK_ACTUAL);
    stockSheet.appendRow([
      product[0], // id_produit
      50, // quantité initiale
      10, // seuil_alerte
      new Date()
    ]);
  });
  
  // Sample supplier
  const supplierSheet = ss.getSheetByName(SHEET_NAMES.SUPPLIERS);
  supplierSheet.appendRow([
    generateId('SUPP'),
    'Bralirwa Ltd',
    'Jean Supplier',
    'supplier@bralirwa.com',
    '+250 788 123 456',
    'KN 5 Ave, Kigali',
    new Date()
  ]);
  
  // Sample customer
  const customerSheet = ss.getSheetByName(SHEET_NAMES.CUSTOMERS);
  customerSheet.appendRow([
    generateId('CUST'),
    'ABC Store',
    'customer@abcstore.com',
    '+250 788 654 321',
    'KG 10 St, Kigali',
    'entreprise',
    new Date()
  ]);
  
  Logger.log('Sample data added');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate unique ID with prefix
 */
function generateId(prefix) {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return prefix + '-' + timestamp + '-' + random;
}

/**
 * Simple password hashing (in production, use more secure method)
 */
function hashPassword(password) {
  // For Google Apps Script, we'll use a simple hash
  // In production, consider using a more secure method
  return Utilities.base64Encode(Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    password + 'SALT_KEY_POS_2026'
  ));
}

/**
 * Verify password
 */
function verifyPassword(password, hashedPassword) {
  return hashPassword(password) === hashedPassword;
}

/**
 * Format date to string
 */
function formatDate(date) {
  if (!date) return '';
  if (typeof date === 'string') return date;
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
}

/**
 * Calculate total from line items
 */
function calculateTotal(lineItems) {
  return lineItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
}

/**
 * Log action to logs sheet
 */
function logAction(userId, action, description) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const logSheet = ss.getSheetByName(SHEET_NAMES.LOGS);
    
    logSheet.appendRow([
      generateId('LOG'),
      new Date(),
      userId,
      action,
      description || ''
    ]);
  } catch (error) {
    Logger.log('Error logging action: ' + error.toString());
  }
}

/**
 * Get configuration
 */
function getConfig() {
  return CONFIG;
}

// ============================================================================
// WEB APP HANDLERS
// ============================================================================

/**
 * Handle GET requests - serve HTML pages
 */
function doGet(e) {
  // Get the page parameter, default to login
  const page = e.parameter.page || 'login';
  
  try {
    // Create HTML output from file
    const htmlOutput = HtmlService.createHtmlOutputFromFile(page)
      .setTitle(CONFIG.COMPANY_NAME)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    
    return htmlOutput;
  } catch (error) {
    Logger.log('Error loading page ' + page + ': ' + error.toString());
    
    // If page not found, try to load login page
    if (page !== 'login') {
      try {
        return HtmlService.createHtmlOutputFromFile('login')
          .setTitle(CONFIG.COMPANY_NAME)
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      } catch (e2) {
        return HtmlService.createHtmlOutput('Error: Could not load any pages. Please check that HTML files are added to Apps Script.');
      }
    }
    
    return HtmlService.createHtmlOutput('Error loading page: ' + error.toString());
  }
}

/**
 * Handle POST requests - API endpoints
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    // Route to appropriate handler
    switch (action) {
      case 'login':
        return ContentService.createTextOutput(JSON.stringify(authenticateUser(data.email, data.password)))
          .setMimeType(ContentService.MimeType.JSON);
      
      // Add more API endpoints as needed
      default:
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Unknown action' }))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================================
// MENU FUNCTIONS
// ============================================================================

/**
 * Add custom menu to spreadsheet
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('POS System')
    .addItem('Initialize System', 'initializeSystem')
    .addSeparator()
    .addItem('Open Dashboard', 'openDashboard')
    .addSeparator()
    .addItem('Export Data', 'exportData')
    .addItem('Import Data', 'importData')
    .addSeparator()
    .addItem('Reset System', 'resetSystem')
    .addToUi();
}

/**
 * Open dashboard in new window
 */
function openDashboard() {
  const html = HtmlService.createHtmlOutputFromFile('index')
    .setWidth(1200)
    .setHeight(800);
  SpreadsheetApp.getUi().showModalDialog(html, 'POS Dashboard');
}

/**
 * Reset system (careful!)
 */
function resetSystem() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Reset System',
    'This will delete all data and reinitialize the system. Are you sure?',
    ui.ButtonSet.YES_NO
  );
  
  if (response === ui.Button.YES) {
    initializeSystem();
  }
}
