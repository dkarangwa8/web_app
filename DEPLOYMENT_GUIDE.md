# 🚀 POS System Deployment Guide

Complete step-by-step instructions to deploy your POS Management System to Google Apps Script.

---

## 📋 Prerequisites

- Google Account (dkarangwa@gmail.com)
- Files from `/home/dieudonne/Documents/web_app/`
- 15-20 minutes for complete setup

---

## 🎯 Deployment Steps

### Step 1: Create Google Spreadsheet

1. **Open Google Sheets**
   - Go to: https://sheets.google.com
   - Click **+ Blank** to create new spreadsheet

2. **Name Your Spreadsheet**
   - Click "Untitled spreadsheet" at the top
   - Rename to: **"POS Management System"**
   - Press Enter to save

### Step 2: Open Apps Script Editor

1. **Access Apps Script**
   - In your spreadsheet, click **Extensions** (top menu)
   - Select **Apps Script**
   - A new tab will open with the Apps Script editor

2. **You'll See**
   - A file called `Code.gs` (default)
   - Some sample code inside

### Step 3: Add Backend Files

#### File 1: Code.gs (Main System)

1. **Replace Default Code**
   - Select ALL the existing code in `Code.gs`
   - Delete it
   - Open `/home/dieudonne/Documents/web_app/Code.gs`
   - Copy ALL the code
   - Paste into the Apps Script `Code.gs`

#### File 2: BackendFunctions.gs

1. **Add New Script File**
   - Click the **+** button next to "Files" (left sidebar)
   - Select **Script**
   - Name it: `BackendFunctions`
   - Press Enter

2. **Add Code**
   - Open `/home/dieudonne/Documents/web_app/BackendFunctions.gs`
   - Copy ALL the code
   - Paste into the new `BackendFunctions` file

#### File 3: OrderStockManagement.gs

1. **Add New Script File**
   - Click **+** next to Files
   - Select **Script**
   - Name it: `OrderStockManagement`
   - Press Enter

2. **Add Code**
   - Open `/home/dieudonne/Documents/web_app/OrderStockManagement.gs`
   - Copy ALL the code
   - Paste into the new `OrderStockManagement` file

#### File 4: ReceiptEmail.gs

1. **Add New Script File**
   - Click **+** next to Files
   - Select **Script**
   - Name it: `ReceiptEmail`
   - Press Enter

2. **Add Code**
   - Open `/home/dieudonne/Documents/web_app/ReceiptEmail.gs`
   - Copy ALL the code
   - Paste into the new `ReceiptEmail` file

#### File 5: appsscript.json

1. **Enable Manifest File**
   - Click the ⚙️ **Settings** icon (left sidebar)
   - Check: ✅ **"Show 'appsscript.json' manifest file in editor"**

2. **Edit Manifest**
   - You'll now see `appsscript.json` in the Files list
   - Click on it
   - Select ALL the existing code
   - Open `/home/dieudonne/Documents/web_app/appsscript.json`
   - Copy ALL the code
   - Paste to replace existing content

### Step 4: Save Your Project

1. **Save Everything**
   - Click the **💾 Save** icon (or Ctrl+S / Cmd+S)
   - Wait for "Saved" confirmation

2. **Name Your Project** (Optional)
   - Click "Untitled project" at the top
   - Rename to: **"POS Backend"**

### Step 5: Initialize the Database

1. **Go Back to Your Spreadsheet**
   - Switch back to the spreadsheet tab
   - Refresh the page (F5 or Cmd+R)

2. **Look for Custom Menu**
   - After refresh, you should see a new menu: **"POS System"**
   - If you don't see it, wait 10-15 seconds and refresh again

3. **Initialize System**
   - Click **POS System** menu
   - Select **Initialize System**

4. **Authorize the Script**
   - A dialog will appear: "Authorization Required"
   - Click **Review Permissions**
   - Click **Advanced**
   - Click **Go to POS Backend (unsafe)**
   - Click **Allow**

5. **Wait for Initialization**
   - A progress dialog will appear
   - Wait for success message
   - This creates all 12 worksheets and sample data

6. **Verify Worksheets Created**
   - You should now see 12 new sheets at the bottom:
     - produits
     - fournisseurs
     - clients
     - utilisateurs
     - commandes_fournisseurs
     - lignes_cf
     - commandes_clients
     - lignes_cc
     - stock_mouvements
     - stock_actuel
     - ventes
     - logs

### Step 6: Deploy as Web App (Frontend)

1. **Go Back to Apps Script**
   - Switch to Apps Script tab

2. **Deploy**
   - Click **Deploy** button (top right)
   - Select **New deployment**

3. **Configure Deployment**
   - Click the gear icon ⚙️ next to "Select type"
   - Choose **Web app**

4. **Set Deployment Settings**
   - **Description**: "POS System v1"
   - **Execute as**: Me (dkarangwa@gmail.com)
   - **Who has access**: Anyone

5. **Deploy**
   - Click **Deploy**
   - Authorize if prompted (same process as before)
   - Copy the **Web app URL** that appears
   - Save this URL somewhere!

### Step 7: Add Frontend HTML Files

For the web app to serve HTML pages, we need to add them to Apps Script:

1. **Add HTML Files**
   - In Apps Script, click **+** next to Files
   - Select **HTML**
   - Name each file exactly as shown below

2. **Files to Add** (11 total):
   
   **a) login.html**
   - Click + → HTML → Name: `login`
   - Copy content from `/home/dieudonne/Documents/web_app/login.html`
   - Paste into Apps Script
   
   **b) index.html**
   - Click + → HTML → Name: `index`
   - Copy content from `/home/dieudonne/Documents/web_app/index.html`
   - Paste into Apps Script
   
   **c) pos.html**
   - Click + → HTML → Name: `pos`
   - Copy content from `/home/dieudonne/Documents/web_app/pos.html`
   - Paste into Apps Script
   
   **d) products.html**
   - Click + → HTML → Name: `products`
   - Copy and paste
   
   **e) stock.html**
   - Click + → HTML → Name: `stock`
   - Copy and paste
   
   **f) sales.html**
   - Click + → HTML → Name: `sales`
   - Copy and paste
   
   **g) suppliers.html**
   - Click + → HTML → Name: `suppliers`
   - Copy and paste
   
   **h) customers.html**
   - Click + → HTML → Name: `customers`
   - Copy and paste
   
   **i) orders.html**
   - Click + → HTML → Name: `orders`
   - Copy and paste
   
   **j) users.html**
   - Click + → HTML → Name: `users`
   - Copy and paste

   **k) styles/main.css** (embedded in HTML)
   - The CSS is already embedded in each HTML file's `<style>` tag
   - No separate CSS file needed in Apps Script

3. **Save All Files**
   - Click **💾 Save**

4. **Redeploy** (if you added HTML after initial deployment)
   - Click **Deploy** → **Manage deployments**
   - Click ✏️ Edit icon
   - Change version to **New version**
   - Click **Deploy**

### Step 8: Access Your POS System

1. **Open the Web App**
   - Use the Web app URL you saved earlier
   - Or: Deploy → Manage deployments → Copy URL

2. **Login**
   - Email: `dkarangwa@gmail.com`
   - Password: `admin123`

3. **You're In!** 🎉
   - You should see the purple dashboard
   - All menu items should work
   - Each module has its own color theme

---

## ✅ Post-Deployment Checklist

- [ ] All 12 worksheets created in spreadsheet
- [ ] Sample data visible in sheets
- [ ] Web app URL accessible
- [ ] Login page loads
- [ ] Can log in with default credentials
- [ ] Dashboard shows stats
- [ ] POS interface works
- [ ] All navigation links work

---

## 🔧 Troubleshooting

### Issue: Custom menu doesn't appear
**Solution**: 
- Refresh the spreadsheet
- Wait 15 seconds
- Try closing and reopening the spreadsheet

### Issue: "Authorization Required" error
**Solution**:
- Click "Review Permissions"
- Click "Advanced"
- Click "Go to [project name] (unsafe)"
- Click "Allow"

### Issue: Web app URL shows error
**Solution**:
- Check all 4 .gs files are added correctly
- Make sure you clicked "Deploy" not just "Save"
- Try "Manage deployments" → "New deployment"

### Issue: HTML pages not found
**Solution**:
- Make sure HTML files are added as HTML type (not Script)
- File names should match exactly (lowercase)
- Redeploy after adding HTML files

### Issue: Can't send emails
**Solution**:
- The script sends from your Google account
- Check Gmail daily sending limits
- Verify customer email addresses are valid

---

## 🎯 Quick Reference

**Spreadsheet URL Format**:
```
https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
```

**Apps Script URL Format**:
```
https://script.google.com/home/projects/[PROJECT_ID]/edit
```

**Web App URL Format**:
```
https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec
```

**Default Login**:
```
Email: dkarangwa@gmail.com
Password: admin123
```

---

## 📚 Next Steps After Deployment

1. **Change Admin Password**
   - Go to the `utilisateurs` sheet
   - Update the password (hash it using the backend function)

2. **Update Company Info**
   - Edit `Code.gs` → `CONFIG` object
   - Update company name, address, phone, email

3. **Add Real Data**
   - Add your actual products
   - Add your suppliers
   - Add your customers

4. **Test the System**
   - Create a test sale in POS
   - Verify stock deduction
   - Check receipt generation
   - Test email sending

5. **Train Your Team**
   - Share the web app URL
   - Create user accounts for staff
   - Assign appropriate roles

---

## 🆘 Need Help?

- Check logs sheet for error messages
- Review README.md for detailed documentation
- Email: dkarangwa@gmail.com
- GitHub: https://github.com/dkarangwa8/web_app

---

**Deployment Time**: 15-20 minutes  
**Difficulty**: Easy ⭐⭐☆☆☆

**Good luck with your deployment! 🚀**
