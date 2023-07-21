
import { checkIfNotEmpty, checkNum } from "./common.js";

let params = new URLSearchParams(location.search);
const userId = params.get('user');
const categoryId = params.get('category-id');
const categoryName = params.get('category-name');

const inputCategoryName = document.getElementById('inputCategoryName');
const categoryHelp = document.getElementById('categoryHelp');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const showAddCategoryModalBtn = document.getElementById('showAddCategoryModalBtn');
const sideBarList = document.getElementById('sideBarList');
const categoryTitle = document.getElementById('categoryTitle');
const cardGalary = document.getElementById('cardGalary');
const content = document.getElementById('content');
const cardContainer = document.getElementById('cardContainer');
const listContainer = document.getElementById('listContainer');
const listBody = document.getElementById('listBody');
const cardViewBtn = document.getElementById('cardViewBtn');
const listViewBtn = document.getElementById('listViewBtn');
const vieMinStockBtn = document.getElementById('vieMinStockBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const deleteCategoryBtn = document.getElementById('deleteCategoryBtn');
const noItemMessage = document.getElementById('noItemMessage');
const showDeleteCategoryBtn = document.getElementById('showDeleteCategoryBtn');
const addCategoryForm = document.getElementById('addCategoryForm');

const inputProductName = document.getElementById('inputProductName');
const inputMinStock = document.getElementById('inputMinStock');
const inputStock = document.getElementById('inputStock');
const productNameHelp = document.getElementById('productNameHelp');
const minsStockHelp = document.getElementById('minsStockHelp');
const stockHelp = document.getElementById('stockHelp');
const showAddProductModalBtn = document.getElementById('showAddProductModalBtn');
const addProductBtn = document.getElementById('addProductBtn');
const linkCategory = document.getElementById('linkCategory');

// Set link of the top bar
linkCategory.setAttribute("href", '../html/category.html?category-name=All&category-id=99999&user=' + encodeURIComponent(userId));

//　Disable the enterkey when imput data in form. 
inputCategoryName.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
});

// Set Categories and Product when window loaded
window.addEventListener('DOMContentLoaded', async () => {

    // Get all category of the user
    const categories = await getAllCategories(userId);

    // Set category to side menu. The first one is All products(category-id=99999).
    let html = `<li class="relative">
                    <a class="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
                        data-te-sidenav-link-ref href="./category.html?user=${userId}&category-name=All&category-id=99999">
                        <span>All</span>
                    </a>
                </li>`;
    categories.getAllCategory.forEach(category => {
        html += `<li class="relative">
                    <a class="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
                        data-te-sidenav-link-ref href="./category.html?user=${userId}&category-name=${category.name}&category-id=${category.id}">
                        <span>${category.name}</span>
                    </a>
                </li>`;
    });
    // Set html.
    sideBarList.innerHTML = html;

    // Set selected category 
    if (categoryId == 99999) {
        categoryTitle.innerText = 'All';
        showAddProductModalBtn.classList.add('hidden');
        showDeleteCategoryBtn.classList.add('hidden');
        // Set all products
        let products = await window.product.getAllProductsOfUser(userId);
        setProducts(products);
    } else {
        categoryTitle.innerText = categoryName;
        // Set products of the category
        let products = await getAllProducts(categoryId);
        setProducts(products);
    }
})

// Togle view mode (Card, List)
listViewBtn.addEventListener('click', () => {
    cardContainer.classList.add('hidden');
    listContainer.classList.remove('hidden');
    cardViewBtn.classList.remove('bg-sub-color-most-dark');
    listViewBtn.classList.add('bg-sub-color-most-dark');
    cardViewBtn.classList.add('bg-sub-color');
    listViewBtn.classList.remove('bg-sub-color');
})
cardViewBtn.addEventListener('click', () => {
    listContainer.classList.add('hidden');
    cardContainer.classList.remove('hidden');
    listViewBtn.classList.remove('bg-sub-color-most-dark');
    cardViewBtn.classList.add('bg-sub-color-most-dark');
    listViewBtn.classList.add('bg-sub-color');
    cardViewBtn.classList.remove('bg-sub-color');
})


// Reset addCategory modal
showAddCategoryModalBtn.addEventListener('click', () => {
    inputCategoryName.value = '';
    categoryHelp.innerText = '';
})

// Reset addProduct modal
showAddProductModalBtn.addEventListener('click', () => {
    inputProductName.value = '';
    inputMinStock.value = '';
    inputStock.value = '';
    productNameHelp.innerText = '';
    minsStockHelp.innerText = '';
    stockHelp.innerText = '';
})

// Add category
addCategoryBtn.addEventListener('click', async () => {

    const addCategoryData = {
        categoryName: inputCategoryName.value,
        userId: userId
    }

    // Validate input value
    if (!checkIfNotEmpty(addCategoryData.categoryName)) {
        categoryHelp.innerText = 'Category name is empty';
        categoryHelp.classList.remove('hidden');
        return
    }

    // Validate if the CategoryName is already exists
    let result = await window.category.categoryCheck(addCategoryData);
    if (!result.categoryCheck) {
        categoryHelp.innerText = 'Category name is already exists';
        categoryHelp.classList.remove('hidden');
        return
    } else {
        // Add category
        const result = await window.category.addCategory(addCategoryData);
        // console.log(result.addCategory);
        if (result.addCategory) window.location.href = `../html/category.html?user=${userId}&category-name=${result.addCategory[0].name}&category-id=${result.addCategory[0].id}`;
    }
})

// Add Product
addProductBtn.addEventListener('click', async () => {

    const addProductData = {
        productName: inputProductName.value,
        minStock: inputMinStock.value,
        stock: inputStock.value,
        userId: userId,
        categoryId: categoryId,
    }

    // CheckValue
    // Validate ProductName
    if (!checkIfNotEmpty(addProductData.productName)) {
        productNameHelp.innerText = 'Product name is empty';
        productNameHelp.classList.remove('hidden');
        return;
    } else {
        productNameHelp.classList.add('hidden');
    }

    // Validate if the productName is already exists
    let validateResult = await window.product.productCheck(addProductData);
    if (!validateResult.productCheck) {
        productNameHelp.innerText = 'Product name is already exists';
        productNameHelp.classList.remove('hidden');
        return;
    } else {
        productNameHelp.classList.add('hidden');
    }

    // Validate minStock & stock
    if (!checkNum(addProductData.minStock) || !checkIfNotEmpty(addProductData.minStock)) {
        minsStockHelp.innerText = 'The value should be number.';
        minsStockHelp.classList.remove('hidden');
        return;
    } else {
        minsStockHelp.classList.add('hidden');
    }

    if (!checkNum(addProductData.stock) || !checkIfNotEmpty(addProductData.stock)) {
        stockHelp.innerText = 'The value should be number.';
        stockHelp.classList.remove('hidden');
        return;
    } else {
        stockHelp.classList.add('hidden');
    }

    // Add product to db
    const result = await window.product.addProduct(addProductData);
    if (result.addProduct) window.location.href = `../html/category.html?user=${userId}&category-name=${categoryName}&category-id=${categoryId}`;
})

/**
 * Get all categories of the user.
 * @param {number} userId 
 * @returns object
 */
async function getAllCategories(userId) {
    let categories = await window.category.getAllCategory(userId);
    return categories;
}

/**
 * Get all products of the category.
 * @param {number} categoryId 
 * @returns object
 */
async function getAllProducts(categoryId) {
    let products = await window.product.getAllProducts(categoryId);
    return products;
}

/**
 * Set products data to generated html. 
 * @param {object} products 
 */
function setProducts(products) {
    // Set products
    let htmlForProductsCard = "";
    let htmlForProductsList = "";
    let itemCount = 0;

    // Message for when thre isn't product.
    if (products.getAllProducts.length == 0) {
        if (categoryId == 99999) {
            showDeleteCategoryBtn.classList.add('hidden');
            noItemMessage.innerText = 'There is no products. Create category from sidebar and add product.'
            noItemMessage.classList.remove('hidden')
        } else {
            noItemMessage.innerText = 'There is no products. Add products from plus button.'
            noItemMessage.classList.remove('hidden');
        }
    }

    // Generate html with product data.
    products.getAllProducts.forEach(product => {
        // For Card item
        htmlForProductsCard +=
            `<div id="cardItem${product.id}" class=" px-2 w-1/4 flex-wrap mb-3 ${(product.stock >= product.min_stock) ? `clearMin` : ``}">
                <div class="block relative w-full h-full rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                    <div class="relative overflow-hidden bg-cover bg-no-repeat h-40 w-full"
                        data-te-ripple-init data-te-ripple-color="light">
                        <img class="rounded-t-lg h-full w-full" src="${product.image_path}"
                            alt=""/>
                    </div>
                    <div class="px-6 pt-3 pb-10 justify-center">
                        <p class="hidden">${product.id}</p>
                        <h6
                            class="text-center mb-2 text-lg font-bold leading-tight break-words text-neutral-800 dark:text-neutral-50">
                            ${product.name}
                        </h6>
                        <p
                            class=" mb-1 text-base text-neutral-600 dark:text-neutral-200 leading-7 text-right">
                            Min ${product.min_stock}</p>
                        <p id="actualStockCard${product.id}"
                            class=" mb-2 text-xl font-bold text-neutral-600 dark:text-neutral-200 leading-7 text-right ${(product.stock < product.min_stock) ? `text-red-600` : `text-neutral-600`}">
                            ${product.stock}</p>
                    </div>
                    <a class="absolute bottom-0 left-0 right-0" href="./product.html?user=${userId}&category-name=${product.categoryName}&category-id=${product.category_id}&product-id=${product.id}">
                        <button type="button"
                            class="mb-3 block mx-auto text-center rounded bg-sub-color px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-sub-color-dark hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-sub-color-dark focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-sub-color-most-dark active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">
                            Detail
                        </button>
                    </a>
                </div>
            </div>`;

        // For list item
        htmlForProductsList +=
            `<tr id="listItem${product.id}" class="border-b ${(itemCount % 2 == 0) ? `bg-white` : `bg-neutral-100`} ${(product.stock >= product.min_stock) ? `clearMin` : ``} dark:border-neutral-500 dark:bg-neutral-600">
                <td class="whitespace-nowrap hidden px-6 py-4 font-bold">${product.id}</td>
                <td class="whitespace-nowrap px-6 py-4 font-bold text-lg">${product.name}</td>
                <td class="whitespace-nowrap px-6 py-4 font-medium">${product.categoryName}</td>
                <td colspan="2" class="whitespace-nowrap px-6 py-4 text-center">
                    <a href="./product.html?user=${userId}&category-name=${product.categoryName}&category-id=${product.category_id}&product-id=${product.id}">
                        <button type="button"
                            class="block mx-auto text-center rounded bg-sub-color px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-sub-color-dark hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-sub-color-dark focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-sub-color-most-dark active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">
                            Detail
                        </button>
                    </a>
                </td>
                <td class="whitespace-nowrap px-6 py-4 font-medium text-center">${product.min_stock}</td>
                <td class="whitespace-nowrap px-6 py-4 font-bold text-center">
                    <div class="flex justify-evenly items-center">
                        <button type="button" data-te-ripple-init id="minusBtn${product.id}"
                            data-te-ripple-color="light"
                            class="inline-block rounded-full bg-sub-color p-2 uppercase leading-normal text-soft-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-sub-color-dark hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-sub-color-dark focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-sub-color-most-dark active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                height="24" viewBox="0 0 24 24" fill="none"
                                stroke="#F4F5F7" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                        <P id="actualStockList${product.id}" class="font-bold text-center text-xl ${(product.stock < product.min_stock) ? `text-red-600` : `text-neutral-600`}">${product.stock}</P>
                        <button type="button" data-te-ripple-init id="plusBtn${product.id}"
                            data-te-ripple-color="light"
                            class="inline-block rounded-full bg-sub-color p-2 uppercase leading-normal text-soft-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-sub-color-dark hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-sub-color-dark focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-sub-color-most-dark active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                height="24" viewBox="0 0 24 24" fill="none"
                                stroke="#F4F5F7" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>`;
        itemCount++;
    });

    // Set html to the page 
    cardGalary.innerHTML = htmlForProductsCard;
    listBody.innerHTML = htmlForProductsList;
    // Set listner to each product.
    setListner(products.getAllProducts);
}

// Set listner for modifi stock
function setListner(products) {
    products.forEach(product => {
        console.log(product);
        const plusBtn = document.getElementById(`plusBtn${product.id}`);
        const minusBtn = document.getElementById(`minusBtn${product.id}`);
        const actualStockList = document.getElementById(`actualStockList${product.id}`);
        const actualStockCard = document.getElementById(`actualStockCard${product.id}`);
        const cardItem = document.getElementById(`cardItem${product.id}`);
        const listItem = document.getElementById(`listItem${product.id}`);

        plusBtn.addEventListener('click', async () => {
            actualStockList.innerText = +actualStockList.innerText + 1;
            actualStockCard.innerText = +actualStockCard.innerText + 1;
            if (+actualStockList.innerText >= product.min_stock) {
                actualStockList.classList.add('text-neutral-600');
                actualStockList.classList.remove('text-red-600');
                actualStockCard.classList.add('text-neutral-600');
                actualStockCard.classList.remove('text-red-600');
                cardItem.classList.add('clearMin');
                listItem.classList.add('clearMin');
            }

            // increment 1 to db
            await window.category.incrementProduct(product);
        })

        minusBtn.addEventListener('click', async () => {
            if (+actualStockList.innerText > 0) {
                actualStockList.innerText = +actualStockList.innerText - 1;
                actualStockCard.innerText = +actualStockCard.innerText - 1;
                console.log(product.min_stock);
                if (+actualStockList.innerText < product.min_stock) {
                    actualStockList.classList.remove('text-neutral-600');
                    actualStockList.classList.add('text-red-600');
                    actualStockCard.classList.remove('text-neutral-600');
                    actualStockCard.classList.add('text-red-600');
                    cardItem.classList.remove('clearMin');
                    listItem.classList.remove('clearMin');
                }

                // decrement 1 to db
                await window.category.decrementProduct(product);
            }
        })
    })
}

// View min stock 
vieMinStockBtn.addEventListener('click', () => {
    vieMinStockBtn.classList.toggle('bg-red-600')
    vieMinStockBtn.classList.toggle('bg-red-800')
    if (vieMinStockBtn.classList.contains('bg-red-600')) {
        const minItems = document.querySelectorAll('.clearMin');
        minItems.forEach((item) => {
            item.classList.remove('hidden')
        })
    } else {
        const minItems = document.querySelectorAll('.clearMin');
        minItems.forEach((item) => {
            item.classList.add('hidden')
        })
    }
})

// Search product
searchBtn.addEventListener('click', async () => {
    if (checkIfNotEmpty(searchInput.value)) {
        const searchData = {
            word: searchInput.value.trim(),
            categoryId: categoryId,
            userId: userId
        }
        
        // Get searched product 
        const searchedProducts = await window.product.getSearchedProducts(searchData);
        console.log(searchedProducts);
        setProducts(searchedProducts);
    }
})

// Delete category
deleteCategoryBtn.addEventListener('click', async () => {
    const result = await window.category.deleteCategory(categoryId);
    if (result.deleteCategory) window.location.href = `../html/category.html?user=${userId}&category-name=All&category-id=99999`;
})