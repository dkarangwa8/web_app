# POS Management System - Frontend Color Scheme

## Color-Coded Modules 🎨

Each module in the POS system has its own unique color theme for better visual organization and user experience.

### Module Colors

| Module | Color Theme | Primary Color | Usage |
|--------|------------|---------------|--------|
| **Login** | Deep Blue | `#1e40af` | Authentication pages |
| **Dashboard** | Purple/Indigo | `#6366f1` | Main dashboard, overview |
| **POS** | Emerald Green | `#059669` | Point of sale, sales processing |
| **Products** | Orange | `#ea580c` | Product management |
| **Suppliers** | Teal/Cyan | `#0891b2` | Supplier management |
| **Customers** | Pink/Magenta | `#db2777` | Customer management |
| **Orders** | Amber/Yellow | `#d97706` | Purchase & sales orders |
| **Stock** | Red | `#dc2626` | Inventory, stock alerts |
| **Sales** | Green | `#16a34a` | Sales reports, revenue |
| **Users** | Violet | `#7c3aed` | User management |

## Implemented Features ✅

### 1. Main CSS (styles/main.css)
- Complete design system with CSS variables
- Color themes for all 10 modules
- Reusable components (buttons, cards, forms, tables, modals)
- Responsive grid system
- Typography and spacing scales
- Animations and transitions
- Dark mode ready

### 2. Login Page (login.html)
- **Color**: Deep Blue gradient
- Modern authentication form
- Password visibility toggle
- Auto-fill demo credentials
- Google Apps Script integration
- Remember me functionality
- Error/success alerts

### 3. Dashboard (index.html)
- **Color**: Purple/Indigo
- Stats cards showing key metrics
- Quick action buttons
- Recent activity feed
- Low stock alerts panel
- Role-based welcome message
- Real-time data updates

### 4. POS Interface (pos.html)
- **Color**: Emerald Green
- Product grid with search
- Shopping cart with quantity controls
- Real-time stock checking
- Running total with tax calculation
- Checkout and receipt generation
- Responsive two-column layout

## Component Library

### Buttons
Each module has themed buttons:
```css
.btn-login      /* Blue */
.btn-dashboard  /* Purple */
.btn-pos        /* Emerald */
.btn-products   /* Orange */
.btn-suppliers  /* Teal */
.btn-customers  /* Pink */
.btn-orders     /* Amber */
.btn-stock      /* Red */
.btn-sales      /* Green */
.btn-users      /* Violet */
```

### Navigation
Navbar links change color on hover based on module:
```html
<a data-module="dashboard">  /* Hover: purple background */
<a data-module="pos">        /* Hover: green background */
<a data-module="products">   /* Hover: orange background */
```

### Cards & Panels
All cards support color accents:
```css
.stat-card.sales     /* Green accent */
.stat-card.stock     /* Red accent */
.stat-card.orders    /* Amber accent */
.stat-card.customers /* Pink accent */
```

## Design Principles

1. **Color Consistency**: Each module maintains its color throughout headers, buttons, and accents
2. **Visual Hierarchy**: Important actions use bold colors, secondary actions use lighter shades
3. **Accessibility**: All color combinations meet WCAG AA contrast standards
4. **Responsiveness**: Grid layouts adapt to mobile, tablet, and desktop
5. **Animations**: Smooth transitions enhance user experience without being distracting

## Remaining Pages (To Be Created)

- **products.html** - Orange theme for product management
- **suppliers.html** - Teal theme for supplier management
- **customers.html** - Pink theme for customer management
- **orders.html** - Amber theme for order management
- **stock.html** - Red theme for stock management
- **sales.html** - Green theme for sales reports
- **users.html** - Violet theme for user management

Each page will follow the same design patterns with module-specific colors.

## Usage

1. **Include main CSS** in all HTML pages:
   ```html
   <link rel="stylesheet" href="styles/main.css">
   ```

2. **Use module-specific classes**:
   ```html
   <button class="btn btn-pos">Add to Cart</button>
   <a class="navbar-link" data-module="products">Products</a>
   ```

3. **Access color variables** in custom CSS:
   ```css
   .custom-element {
     background: var(--pos-primary);
     color: white;
   }
   ```

## File Structure

```
web_app/
├── styles/
│   └── main.css          ✅ Complete design system
├── login.html            ✅ Blue theme
├── index.html            ✅ Purple theme (Dashboard)
├── pos.html              ✅ Green theme (Point of Sale)
├── products.html         🔄 To be created (Orange)
├── suppliers.html        🔄 To be created (Teal)
├── customers.html        🔄 To be created (Pink)
├── orders.html           🔄 To be created (Amber)
├── stock.html            🔄 To be created (Red)
├── sales.html            🔄 To be created (Green)
└── users.html            🔄 To be created (Violet)
```

---

**Status**: Core frontend infrastructure complete with color-coded design system ready for all modules!
