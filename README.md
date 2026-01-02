# POS Management System - Google Apps Script

A comprehensive Point of Sale management system built with Google Apps Script and Google Sheets. Manage products, suppliers, customers, orders, stock, and sales with automated receipt generation and email delivery.

## 🚀 Features

- **Product Management**: Complete CRUD operations for products with categories and pricing
- **Supplier Management**: Track suppliers and manage purchase orders
- **Customer Management**: Maintain customer database (individuals and businesses)
- **Point of Sale (POS)**: Quick sale processing with cart, stock checking, and receipt generation
- **Order Management**: Handle both supplier and customer orders
- **Stock Tracking**: Automatic stock updates, movement history, and low stock alerts
- **Sales Reporting**: Comprehensive sales analytics and performance metrics
- **Receipt Generation**: Professional HTML receipts sent via email
- **User Management**: Role-based access control (Admin, Gestionnaire, Vendeur)
- **Email Integration**: Automated receipt delivery to customers

## 📋 Prerequisites

- Google Account
- Access to Google Sheets and Google Apps Script
- Basic understanding of spreadsheets

## 🛠️ Installation & Setup

### Step 1: Create a New Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **'+ Blank'** to create a new spreadsheet
3. Name it **"POS Management System"**

### Step 2: Open Apps Script Editor

1. In your spreadsheet, go to **Extensions** > **Apps Script**
2. You'll see the Apps Script editor with a default `Code.gs` file

### Step 3: Add the Script Files

Delete the default content in `Code.gs` and copy the following files from the `web_app` directory:

**File 1: Code.gs** (Main initialization and configuration)
- Copy the entire content from `Code.gs`
- Paste into the Apps Script editor

**File 2: Add New Script File - BackendFunctions.gs**
- Click the **+** button next to Files
- Select **Script**
- Name it `BackendFunctions`
- Copy content from `BackendFunctions.gs`

**File 3: Add New Script File - OrderStockManagement.gs**
- Click **+** button > **Script**
- Name it `OrderStockManagement`
- Copy content from `OrderStockManagement.gs`

**File 4: Add New Script File - ReceiptEmail.gs**
- Click **+** button > **Script**
- Name it `ReceiptEmail`
- Copy content from `ReceiptEmail.gs`

**File 5: Update appsscript.json**
- In the Apps Script editor, look for the gear icon ⚙️ (Project Settings) in the left sidebar
- Enable **"Show 'appsscript.json' manifest file in editor"**
- Click on `appsscript.json` in the Files section
- Replace its content with the content from `appsscript.json`

### Step 4: Save and Initialize

1. Click the **Save** button (disk icon) in the toolbar
2. Refresh your Google Spreadsheet
3. You should see a new menu **"POS System"** appear in the menu bar
4. Click **POS System** > **Initialize System**
5. Authorize the script when prompted (click **Review Permissions** > **Allow**)
6. Wait for the initialization to complete

### Step 5: Verify Installation

After initialization, you should see 12 new sheets created:
- `produits`
- `fournisseurs`
- `clients`
- `utilisateurs`
- `commandes_fournisseurs`
- `lignes_cf`
- `commandes_clients`
- `lignes_cc`
- `stock_mouvements`
- `stock_actuel`
- `ventes`
- `logs`

## 👤 Default Admin Credentials

After initialization, use these credentials to log in:

- **Email**: `dkarangwa@gmail.com`
- **Password**: `admin123`

**⚠️ Important**: Change the password after first login!

## 📊 Database Schema

### Products (`produits`)
- id_produit, nom, description, catégorie, prix_achat, prix_vente, statut, date_creation

### Suppliers (`fournisseurs`)
- id_fournisseur, nom, contact, email, téléphone, adresse, date_creation

### Customers (`clients`)
- id_client, nom, email, téléphone, adresse, type, date_inscription

### Users (`utilisateurs`)
- id_user, nom, email, password, rôle, statut, date_creation

### Stock (`stock_actuel`)
- id_produit, quantité, seuil_alerte, dernier_mouvement

### Sales (`ventes`)
- id_vente, id_commande_c, date_vente, montant, remise, bénéfice, id_user

## 🔑 User Roles & Permissions

### Admin
- Full system access
- User management
- All configurations
- All reports

### Gestionnaire (Manager)
- Supplier order management
- Stock management
- Product management
- Reports viewing

### Vendeur (Seller)
- POS operations
- Customer orders
- Stock viewing
- Sales processing

## 📧 Email Configuration

The system uses Google's MailApp service to send receipts. 

**Daily Sending Limits:**
- Free Gmail account: 100 emails/day
- Google Workspace account: 1,500 emails/day

**Configuration:**
Emails are sent from the Google account that deploys the web app. Update company information in `Code.gs`:

```javascript
const CONFIG = {
  ADMIN_EMAIL: 'dkarangwa@gmail.com',
  COMPANY_NAME: 'POS Management System',
  COMPANY_EMAIL: 'dkarangwa@gmail.com',
  COMPANY_PHONE: '+250 XXX XXX XXX',
  COMPANY_ADDRESS: 'Kigali, Rwanda',
  TAX_RATE: 0.18,
  CURRENCY: 'RWF'
};
```

## 🎯 Usage Guide

### Adding Products
1. Open the `produits` sheet
2. Run the function `addProduct()` via script or use the planned web interface
3. Or manually add to sheet following the column structure

### Creating a Sale (POS)
1. Create customer order with `createCustomerOrder()`
2. Validate order with `validateCustomerOrder()` - this deducts stock
3. System automatically creates sale record
4. Generate receipt with `generateReceipt(orderId)`
5. Email receipt with `sendReceiptEmail(orderId, userId)`

### Managing Stock
1. Stock is automatically updated when:
   - Supplier orders are received
   - Customer orders are validated
2. Manual adjustments via `updateStock()`
3. Check low stock with `checkLowStock()`

### Supplier Orders
1. Create order: `createSupplierOrder(orderData, userId)`
2. When goods arrive: `receiveSupplierOrder(orderId, userId)`
3. Stock automatically increases

## 📱 Web Interface (Coming Soon)

Frontend HTML pages for:
- Login/Authentication
- Dashboard
- POS Interface
- Product Management
- Customer Management
- Supplier Management
- Order Management
- Stock Management
- Sales Reports
- User Management

## 🔒 Security Notes

1. **Password Hashing**: Passwords are hashed using SHA-256. For production, consider stronger encryption.
2. **Access Control**: Web app access can be restricted in deployment settings.
3. **Data Validation**: Always validate user input before processing.
4. **Permissions**: Use role-based access control functions before allowing operations.

## 📞 Support & Contact

For issues or questions:
- Email: dkarangwa@gmail.com
- System logs are recorded in the `logs` sheet

## 🚦 Testing Functions

You can test individual functions from the Apps Script editor:

```javascript
// Test authentication
authenticateUser('dkarangwa@gmail.com', 'admin123');

// Test getting products
getProducts();

// Test stock check
checkLowStock();

// Preview a receipt
previewReceipt('CO-xxxxx'); //Replace with actual order ID
```

## 📝 Customization

### Change Tax Rate
Edit `CONFIG.TAX_RATE` in `Code.gs` (default: 0.18 = 18%)

### Change Currency
Edit `CONFIG.CURRENCY` in `Code.gs` (default: 'RWF')

### Update Company Info
Modify the `CONFIG` object in `Code.gs` with your company details

## ⚠️ Troubleshooting

### "Authorization Required" Error
- Go to Apps Script editor > Run > initializeSystem
- Click "Review Permissions" and allow access

### Emails Not Sending
- Check daily sending limit not exceeded
- Verify customer email addresses are valid
- Check `logs` sheet for error messages

### Worksheets Not Created
- Run **POS System** > **Reset System** (⚠️ This deletes all data)
- Or run **POS System** > **Initialize System** again

## 📌 Version

Current Version: 1.0.0  
Last Updated: January 2026

## 📄 License

This project is created for internal business use.

---

**Made with ❤️ using Google Apps Script**
