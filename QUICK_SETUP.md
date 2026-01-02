# Quick Setup Guide - POS Management System

## 🚀 Fast Track Installation (5 Minutes)

### Step 1: Create Google Spreadsheet
1. Go to https://sheets.google.com
2. Click **+ Blank** 
3. Name it: "POS Management System"

### Step 2: Open Apps Script
1. **Extensions** → **Apps Script**

### Step 3: Copy Scripts
Copy these 4 files in order:

#### 1️⃣ Code.gs (already exists)
- Delete existing content
- Paste from `Code.gs`

#### 2️⃣ BackendFunctions.gs
- Click **+** next to Files  
- Select **Script**
- Name: `BackendFunctions`
- Paste from `BackendFunctions.gs`

#### 3️⃣ OrderStockManagement.gs  
- Click **+** → **Script**
- Name: `OrderStockManagement`
- Paste from `OrderStockManagement.gs`

#### 4️⃣ ReceiptEmail.gs
- Click **+** → **Script**
- Name: `ReceiptEmail`
- Paste from `Receipt Email.gs`

#### 5️⃣ appsscript.json
- Click ⚙️ **Project Settings** 
- Enable: "Show 'appsscript.json' manifest file"
- Click `appsscript.json` in Files
- Replace content with `appsscript.json`

### Step 4: Save & Initialize
1. Click **Save** (disk icon)
2. Close Apps Script tab
3. Refresh your spreadsheet
4. Click **POS System** menu → **Initialize System**
5. Click **Review Permissions** → **Advanced** → **Go to POS Management System** → **Allow**
6. Wait for success message

### Step 5: Login
**Email**: `dkarangwa@gmail.com`  
**Password**: `admin123`

## ✅ What You Get

### 12 Worksheets Created:
✓ Products (produits)  
✓ Suppliers (fournisseurs)  
✓ Customers (clients)  
✓ Users (utilisateurs)  
✓ Supplier Orders (commandes_fournisseurs)  
✓ Customer Orders (commandes_clients)  
✓ Stock (stock_actuel)  
✓ Stock Movements (stock_mouvements)  
✓ Sales (ventes)  
✓ Order Lines (lignes_cf, lignes_cc)  
✓ System Logs (logs)

### 5 Sample Products:
1. Coca-Cola 500ml
2. Pain blanc
3. Lait 1L
4. Riz 1kg
5. Sucre 1kg

Each with initial stock of 50 units

## 🎯 Quick Test

### Test the System:
```javascript
// In Apps Script editor, select function and click Run

// 1. Test login
authenticateUser('dkarangwa@gmail.com', 'admin123')

// 2. View products  
getProducts()

// 3. Check low stock
checkLowStock()

// 4. View sample data
getSuppliers()
getCustomers()
```

## 📧 Email Setup

Receipts sent from: **Your Google Account**

**Limits:**
- Free Gmail: 100 emails/day
- Workspace: 1,500 emails/day

## ⚙️ Configuration

Edit in `Code.gs`:
```javascript
const CONFIG = {
  ADMIN_EMAIL: 'dkarangwa@gmail.com',        // ← Your email
  COMPANY_NAME: 'POS Management System',     // ← Your company
  COMPANY_EMAIL: 'dkarangwa@gmail.com',      // ← Your email
  COMPANY_PHONE: '+250 XXX XXX XXX',         // ← Your phone
  COMPANY_ADDRESS: 'Kigali, Rwanda',         // ← Your address
  TAX_RATE: 0.18,                            // ← Tax rate
  CURRENCY: 'RWF'                            // ← Currency
};
```

## 🔧 Common Issues

### ❌ "Reference Error: SHEET_NAMES is not defined"
**Fix**: Make sure all 4 .gs files are added correctly

### ❌ "Authorization required"
**Fix**: Run any function from Apps Script → Click "Review Permissions" → Allow

### ❌ Menu doesn't appear
**Fix**: Refresh spreadsheet, or close and reopen

### ❌ Initialization failed
**Fix**: **POS System** → **Reset System** (deletes all data)

## 📚 Next Steps

1. **Update CONFIG** with your company info
2. **Change admin password** (edit in `utilisateurs` sheet)
3. **Add real products** to `produits` sheet
4. **Add suppliers** to `fournisseurs` sheet
5. **Add customers** to `clients` sheet

## 🆘 Need Help?

Check `logs` sheet for error messages  
Email: dkarangwa@gmail.com

---

**Setup Time**: ~5 minutes  
**Difficulty**: Easy ⭐☆☆☆☆
