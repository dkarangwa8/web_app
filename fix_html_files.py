#!/usr/bin/env python3
"""
Fix HTML files for Google Apps Script by embedding CSS inline
"""

import os
import re

# Read the main CSS file
with open('styles/main.css', 'r') as f:
    main_css = f.read()

# List of HTML files to fix
html_files = [
    'index.html',
    'pos.html',
    'products.html',
    'stock.html',
    'sales.html',
    'suppliers.html',
    'customers.html',
    'orders.html',
    'users.html'
]

print("Fixing HTML files for Google Apps Script compatibility...")
print("=" * 60)

for html_file in html_files:
    print(f"\nProcessing: {html_file}")
    
    # Read the HTML file
    with open(html_file, 'r') as f:
        content = f.read()
    
    # Remove the external CSS link
    content = re.sub(
        r'<link\s+rel="stylesheet"\s+href="styles/main\.css">',
        '',
        content
    )
    
    # Find where to insert the CSS (after <head> tag or before first <style>)
    if '<style>' in content:
        # Insert before the first <style> tag
        content = content.replace(
            '<style>',
            f'<style>\n{main_css}\n</style>\n  <style>',
            1  # Only replace first occurrence
        )
    else:
        # Insert after </head> if no style tag exists
        content = content.replace(
            '</head>',
            f'  <style>\n{main_css}\n  </style>\n</head>'
        )
    
    # Fix navigation links to use URL parameters
    content = re.sub(
        r'href="(\w+)\.html"',
        lambda m: f'href="#" onclick="navigateTo(\'{m.group(1)}\')"',
        content
    )
    
    # Write to apps-script-ready folder
    output_path = f'apps-script-ready/{html_file}'
    with open(output_path, 'w') as f:
        f.write(content)
    
    print(f"  ✓ Created: {output_path}")

# Also copy login.html (it's already good)
print(f"\nCopying: login.html (already has embedded CSS)")
with open('login.html', 'r') as f:
    login_content = f.read()
    
# Fix navigation in login too
login_content = re.sub(
    r'window\.location\.href = \'index\.html\'',
    'navigateTo(\'index\')',
    login_content
)

with open('apps-script-ready/login.html', 'w') as f:
    f.write(login_content)
print(f"  ✓ Created: apps-script-ready/login.html")

print("\n" + "=" * 60)
print("✅ All files fixed and ready!")
print(f"\nFixed files are in: apps-script-ready/")
print("\nNext steps:")
print("1. Go to your Apps Script project")
print("2. For each HTML file, replace its content with the fixed version")
print("3. Save all files")
print("4. Redeploy as 'New version'")
print("5. Test the new URL!")
