import { checkIfNotEmpty, checkNum } from "./common.js";

let params = new URLSearchParams(location.search);
const userId = params.get('user');
const categoryId = params.get('category-id');
const categoryName = params.get('category-name');
const productId = params.get('product-id');

const imageInput = document.getElementById('imageInput');
const productImage = document.getElementById('productImage');
const productTitle = document.getElementById('productTitle');
const categoryTitle = document.getElementById('categoryTitle');
const minStoctInput = document.getElementById('minStoctInput');
const stockInput = document.getElementById('stockInput');
const changeBtn = document.getElementById('changeBtn');
const deleteBtn = document.getElementById('deleteBtn');
const deleteProductBtn = document.getElementById('deleteProductBtn');
const minStockLabel = document.getElementById('minStockLabel');
const stockLabel = document.getElementById('stockLabel');
const stockHelp = document.getElementById('stockHelp');
const minStockHelp = document.getElementById('minStockHelp'); 
const changeImageBtn = document.getElementById('changeImageBtn'); 
const linkCategory = document.getElementById('linkCategory');
const backBtn = document.getElementById('backBtn');

// Set link of the top bar
linkCategory.setAttribute("href", '../html/category.html?category-name=All&category-id=99999&user=' + encodeURIComponent(userId));

// Variable for the product image. 
let actualImage;

// Set listner for backBtn
backBtn.addEventListener('click', () => {
    window.history.back();
})

// Set product detail when loaded contents
window.addEventListener('DOMContentLoaded', async () => {
    const product = await window.product.getProduct(productId);

    // Change style
    minStoctInput.setAttribute('data-te-input-state-active', '')
    stockInput.setAttribute('data-te-input-state-active', '')
    const minStockBox = minStockHelp.nextElementSibling;
    const stockBox = stockHelp.nextElementSibling;
    minStockBox.setAttribute('data-te-input-state-active', '')
    stockBox.setAttribute('data-te-input-state-active', '')

    // Set image and data of the product
    productImage.setAttribute('src', product.getProduct.image_path);
    actualImage = product.getProduct.image_path;
    productTitle.innerText = product.getProduct.name;
    categoryTitle.innerText = categoryName;
    minStoctInput.value = product.getProduct.min_stock;
    stockInput.value = product.getProduct.stock;
})

// Delete product
deleteProductBtn.addEventListener('click', async () => {
    const productData = {
        categoryId: categoryId,
        productId: productId,
        actualImage: actualImage
    }
    const result = await window.product.deleteProduct(productData);

    if (result.deleteProduct)  window.location.href = `../html/category.html?user=${userId}&category-name=${categoryName}&category-id=${categoryId}`;
})

// Change product detail
changeBtn.addEventListener('click', async () => {
    // Get input value
    const productData = {
        minStock: minStoctInput.value,
        stock: stockInput.value,
        imagePath: imageInput.value,
        categoryId: categoryId,
        productId: productId,
        actualImage: actualImage
    }

    // Validate minStock & stock
    if (!checkNum(productData.minStock) || !checkIfNotEmpty(productData.minStock)) {
        minStockHelp.innerText = 'The value should be number.';
        minStockHelp.classList.remove('hidden');
        return;
    }else{
        minStockHelp.classList.add('hidden');
    }
    
    if (!checkNum(productData.stock) || !checkIfNotEmpty(productData.stock)) {
        stockHelp.innerText = 'The value should be number.';
        stockHelp.classList.remove('hidden');
        return;
    }else{
        stockHelp.classList.add('hidden');
    }

    // Update product 
    const updateProduct = await window.product.updateProduct(productData);

    if (updateProduct.updateProduct) window.location.href = `../html/category.html?user=${userId}&category-name=${categoryName}&category-id=${categoryId}`;
})

// Display the file explorer for chose image
changeImageBtn.addEventListener('click', async () => {
    const imgFile = await window.product.chooseImg();
    if (imgFile.chooseImg.canceled) {
        imageInput.value = '';
    }else{
        imageInput.value = imgFile.chooseImg.filePaths[0];
    }
})