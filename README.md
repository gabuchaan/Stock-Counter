
 [日本語版READMEはこちら](https://github.com/gabuchaan/Stock-Counter/blob/main/README_JP.md)

# Stock Counter

## Overview
Stock Counter is a simple desktop application for inventory management, designed for both Windows and Mac. With this app, users can easily keep track of their product stocks at a glance. Additionally, users can set a minimum required quantity for each product, and the app provides a feature to display a list of products that have fallen below the minimum required quantity, helping to prevent stock shortages.

## Technology Stack
* Node.js
* Electron
* Sqlite
* HTML
* Tailwind CSS
* CSS
* JavaScript

## Installation
* ### Windows
     You can download the installer from the following link. Microsoft Defender SmartScreen may display a         warning.

  [Stock Counter for windows](https://github.com/gabuchaan/Stock-Counter/releases/tag/v1.0.0)
* ### Mac
　　__Please note that Node.js must be installed on your Mac.__
   
1. Clone this repository.
   ```
   git clone https://github.com/gabuchaan/Stock-Counter.git
   ```
3. Install npm packages.
   ```
   npm install
   ```
5. Build the application.
   ```
   node_modules/.bin/electron-builder --mac --x64
   ```
7. The installer file __Stock_counter-1.0.0.dmg__ will be created inside the dist folder of the project.
   

## Usage

* ### Create Categories
From the main screen of Stock Counter, you can create categories. Click on "Category" in the menu bar and select "Add category". Enter the category name and it will be created.

* ### Create Products
Select the category where you want to add a product from the category list screen, and click on the + icon. Enter the details of the product, and it will be added to that category.

* ### Edit Products
You can edit the stock quantity, minimum stock quantity, and image of a product. Select the product you want to modify from the category list screen, click on "Detail", enter the desired information, and click on "Change".

* ### Change View
You can switch between card view and list view. In list view, you can directly increase or decrease the stock quantity.

* ### Filtering
Display a list of products that have fallen below the minimum required quantity. Click on "Product" in the menu bar and select "Out-of-stock Products". The out-of-stock products will be displayed.
