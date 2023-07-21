const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('auth', {
    getRemember: () => ipcRenderer.invoke('getRemember'),
    login: (loginData) => ipcRenderer.invoke('login', loginData),
    registerCheck: (registerData) => ipcRenderer.invoke('registerCheck', registerData),
    register: (registerData) => ipcRenderer.invoke('register', registerData),
})

contextBridge.exposeInMainWorld('category', {
    categoryCheck: (AddCategoryData) => ipcRenderer.invoke('categoryCheck', AddCategoryData),
    addCategory: (AddCategoryData) => ipcRenderer.invoke('addCategory', AddCategoryData),
    getAllCategory: (userId) => ipcRenderer.invoke("getAllCategory", userId),
    incrementProduct: (productData) => ipcRenderer.invoke('incrementProduct', productData),
    decrementProduct: (productData) => ipcRenderer.invoke('decrementProduct', productData),
    deleteCategory: (categoryId) => ipcRenderer.invoke('deleteCategory', categoryId),
})

contextBridge.exposeInMainWorld('product', {
    getAllProducts: (categoryId) => ipcRenderer.invoke("getAllProducts", categoryId),
    getAllProductsOfUser: (userId) => ipcRenderer.invoke("getAllProductsOfUser", userId),
    productCheck: (addProductData) => ipcRenderer.invoke('productCheck', addProductData),
    addProduct: (addProductData) => ipcRenderer.invoke('addProduct', addProductData),
    getProduct: (productId) => ipcRenderer.invoke('getProduct', productId),
    deleteProduct: (productId) => ipcRenderer.invoke('deleteProduct', productId),
    updateProduct: (productData) => ipcRenderer.invoke('updateProduct', productData),
    chooseImg: () => ipcRenderer.invoke('chooseImg'),
    getSearchedProducts: (searchData) => ipcRenderer.invoke('getSearchedProducts', searchData),
})


contextBridge.exposeInMainWorld('user', {
    getUser: (userId) => ipcRenderer.invoke('getUser', userId),
})