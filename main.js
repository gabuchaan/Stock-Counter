
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// -------------- Conect to database -----------------
// For dev
// const db = new sqlite3.Database(path.resolve(__dirname, 'stock.sqlite'));
// For deploy
// const db = new sqlite3.Database(path.resolve(__dirname, '..', 'stock.sqlite'));


// ------------ For dev ------------------
// Change manualy if it is dev or not
const isDev = false;

// ------------ Start App ----------------
const createWindow = () => {
    const win = new BrowserWindow({
        width: 1024,
        height: 768,
        // resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.setMenuBarVisibility(false);
    win.loadFile(path.join(__dirname, 'src/html/index.html'))
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// ----------------------------------------
// ----------------- IPC ------------------
// ----------------------------------------

// ------------------- LOGIN ----------------------
ipcMain.handle('getRemember', async (event) => {
    let result = await getRememberUser();
    return { 'rememberUser': result }
})

ipcMain.handle('login', async (event, loginData) => {
    let result = await validateLogin(loginData);
    return { 'login': result }
});

// ------------------- REGISTER -------------------
ipcMain.handle('registerCheck', async (event, registerData) => {
    let result = await validateRegister(registerData);
    return { 'registerCheck': result }
});

ipcMain.handle('register', async (event, registerData) => {
    let result = await createUser(registerData);
    return { 'register': result }
});

// ------------------- CATEGORY -------------------
ipcMain.handle('categoryCheck', async (event, addCategoryData) => {
    let result = await validateCategory(addCategoryData);
    return { 'categoryCheck': result }
})

ipcMain.handle('addCategory', async (event, addCategoryData) => {
    let result = await addCategory(addCategoryData);
    return { 'addCategory': result }
})

ipcMain.handle('getAllCategory', async (event, userId) => {
    result = await getAllCategory(userId);
    return { 'getAllCategory': result };
});

ipcMain.handle('deleteCategory', async (event, categoryId) => {
    result = await deleteCategory(categoryId);
    return { 'deleteCategory': result };
});

// ------------------- PRODUCTS -------------------
ipcMain.handle('getAllProducts', async (event, categoryId) => {
    result = await getAllProducts(categoryId);
    return { 'getAllProducts': result };
});

ipcMain.handle('getAllProductsOfUser', async (event, userId) => {
    result = await getAllProductsOfUser(userId);
    return { 'getAllProducts': result };
});

ipcMain.handle('productCheck', async (event, addProductData) => {
    let result = await validateProduct(addProductData);
    return { 'productCheck': result }
})

ipcMain.handle('addProduct', async (event, addProductData) => {
    let result = await addProduct(addProductData);
    return { 'addProduct': result }
})

ipcMain.handle('getProduct', async (event, productId) => {
    let result = await getProduct(productId);
    return { 'getProduct': result }
})

ipcMain.handle('deleteProduct', async (event, productData) => {
    let result = await deleteProduct(productData);
    return { 'deleteProduct': result }
})

ipcMain.handle('updateProduct', async (event, productData) => {
    let result = await updateProduct(productData);
    return { 'updateProduct': result }
})

ipcMain.handle('incrementProduct', async (event, productData) => {
    let result = await incrementProduct(productData);
    return { 'incrementProduct': result }
})

ipcMain.handle('decrementProduct', async (event, productData) => {
    let result = await decrementProduct(productData);
    return { 'decrementProduct': result }
})

ipcMain.handle('getSearchedProducts', async (event, searchData) => {
    let result = await getSearchedProducts(searchData);
    return { 'getAllProducts': result }
})

ipcMain.handle('chooseImg', async () => {
    const file = await dialog.showOpenDialog({ filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }] });
    return { 'chooseImg': file };
})


// ---------------------------------------------
// ----------------- Functions -----------------
// ---------------------------------------------

/**
 * 
 * @returns The last user that has rememebr password.
 */
function getRememberUser() {
    const db = (isDev) ? new sqlite3.Database(path.resolve(__dirname, 'stock.sqlite')) : new sqlite3.Database(path.resolve(__dirname, '..', 'stock.sqlite'));
    console.log(typeof db);

    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users where remember = ?", [1], (err, row) => {
            if (row != null) {
                db.close();
                return resolve(row);
            }
            db.close();
            return resolve(false);
        });
    })
}

/**
 * Check if the userName and password are correct.
 * @param {object} loginData 
 * @returns Boolean 
 */
function validateLogin(loginData) {
    const db = (isDev) ? new sqlite3.Database(path.resolve(__dirname, 'stock.sqlite')) : new sqlite3.Database(path.resolve(__dirname, '..', 'stock.sqlite'));

    const userName = loginData.userName;
    const password = loginData.password;

    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users where name = ? AND password = ?", [userName, password], (err, row) => {
            if (row != null) {
                changeRmemberStatus(db, row.id, loginData.rememberCheck);
                db.close();
                return resolve(row.id);
            } else {
                db.close();
                return resolve(false);
            }
        })
    })
}

/**
 * Check if the userName is aready exists
 * @param {object} registerData 
 * @returns Boolean
 */
function validateRegister(registerData) {
    const db = (isDev) ? new sqlite3.Database(path.resolve(__dirname, 'stock.sqlite')) : new sqlite3.Database(path.resolve(__dirname, '..', 'stock.sqlite'));

    return new Promise((resolve, reject) => {
        db.get(`select count(*) as count from users where name = ?`, registerData.userName, (err, row) => {
            if (err) {
                db.close();
                return reject(err);
            }
            if (row.count != 0) {
                db.close();
                return resolve(false);
            } else {
                db.close();
                return resolve(true);
            }
        });
    })
}

/**
 * Create user in DB. If it ceated correctly, return true. 
 * @param {object} obj 
 * @returns Boolean
 */
function createUser(obj) {
    const db = (isDev) ? new sqlite3.Database(path.resolve(__dirname, 'stock.sqlite')) : new sqlite3.Database(path.resolve(__dirname, '..', 'stock.sqlite'));


    const createdAt = new Date().getTime();
    return new Promise((resolve, reject) => {
        db.run(`insert into users(name ,password, created_at, remember) values(?,?,?,?)`, [obj.userName, obj.password, createdAt, obj.remember], (err) => {
            db.close();
            return resolve(true);
        });
    })
}

/**
 * Change of the remember status of user.
 * @param {object} db 
 * @param {number} userId 
 * @param {boolean} remember 
 */
function changeRmemberStatus(db, userId, remember) {
    let dataReset = [0];
    let resetSql = `UPDATE users SET remember=?`;

    let value = (remember) ? 1 : 0;

    db.run(resetSql, dataReset, function () {
        let data = [value, userId];
        let sql = `UPDATE users SET remember=? WHERE id=?`;
        db.run(sql, data);
    });
}

/**
 * Check if the categoryName is allredy exists. 
 * @param {object} addCategoryData 
 * @returns Boolean
 */
function validateCategory(addCategoryData) {
    const db = (isDev) ? new sqlite3.Database(path.resolve(__dirname, 'stock.sqlite')) : new sqlite3.Database(path.resolve(__dirname, '..', 'stock.sqlite'));

    return new Promise((resolve, reject) => {
        db.get(`Select COUNT(*) as count from categories 
        inner join users ON categories.user_id  = users.id
        where user_id = ? 
        and categories.name = ?`, [addCategoryData.userId, addCategoryData.categoryName], (err, row) => {
            if (err) {
                db.close();
                return reject(err);
            }
            if (row.count != 0) {
                db.close();
                return resolve(false);
            } else {
                db.close();
                return resolve(true);
            }
        });
    })
}

/**
 * Add new category in DB.
 * @param {object} AddCategoryData 
 * @returns The category that have created in this function.
 */
function addCategory(AddCategoryData) {
    const db = (isDev) ? new sqlite3.Database(path.resolve(__dirname, 'stock.sqlite')) : new sqlite3.Database(path.resolve(__dirname, '..', 'stock.sqlite'));

    const createdAt = new Date().getTime();
    return new Promise((resolve, reject) => {
        db.run(`insert into categories(name ,user_id, created_at) values(?,?,?)`, [AddCategoryData.categoryName, AddCategoryData.userId, createdAt], (err, row) => {
            if (err) {
                db.close();
                return resolve(false);
            } else {
                db.all("SELECT * FROM categories WHERE user_id = ? ORDER BY created_at DESC LIMIT 1 ", [AddCategoryData.userId], (err, rows) => {
                    let categories = [];
                    rows.forEach(function (row) {
                        // Make directory for images of the new category's products.
                        const imagePath = path.join(app.getPath('userData'), 'product-image', row.id.toString());
                        if (!fs.existsSync(imagePath)) {
                            fs.mkdirSync(imagePath, { recursive: true });
                        }
                        categories.push(row);
                    });
                    db.close();
                    return resolve(categories);
                });
            }
        });
    })
}

/**
 * Get all categories of the user.
 * @param {number} userId 
 * @returns Array
 */
function getAllCategory(userId) {
    const db = (isDev) ? new sqlite3.Database(path.resolve(__dirname, 'stock.sqlite')) : new sqlite3.Database(path.resolve(__dirname, '..', 'stock.sqlite'));

    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM categories WHERE user_id = ? ORDER BY created_at ASC ", [userId], (err, rows) => {
            let categories = [];
            rows.forEach(function (row) {
                categories.push(row);
            });
            db.close();
            return resolve(categories);
        });
    });
}

/**
 * Delete category from DB.
 * @param {number} categoryId 
 * @returns 
 */
function deleteCategory(categoryId) {
    const db = (isDev) ? new sqlite3.Database(path.resolve(__dirname, 'stock.sqlite')) : new sqlite3.Database(path.resolve(__dirname, '..', 'stock.sqlite'));

    // Delete all products of this category
    return new Promise((resolve, reject) => {
        let sqlProduct = "DELETE FROM products WHERE category_id=(?)";
        db.run(sqlProduct, categoryId, (err) => {
            if (err) {
                reject(err);
                db.close();
            } else {
                let sql = "DELETE FROM categories WHERE id=(?)";
                db.run(sql, categoryId, (err) => {
                    db.close();
                    deleteAllImage(categoryId);
                    (err) ? reject(err) : resolve(true)
                });
            }
        });

    });
}

/**
 * Get all products of the catgory.
 * @param {number} categoryId 
 * @returns Array
 */
function getAllProducts(categoryId) {
    const db = (isDev) ? new sqlite3.Database(path.resolve(__dirname, 'stock.sqlite')) : new sqlite3.Database(path.resolve(__dirname, '..', 'stock.sqlite'));

    return new Promise((resolve, reject) => {
        db.all("SELECT products.id as id, products.name as name, min_stock,stock ,category_id ,products.created_at as created_at, image_path, categories.name as categoryName FROM products INNER JOIN categories on categories.id = products.category_id  WHERE category_id = ? ORDER BY created_at ASC ", [categoryId], (err, rows) => {
            let products = [];
            rows.forEach(function (row) {
                products.push(row);
            });
            return resolve(products);
        });
    });
}

/**
 * Get all products of the user.
 * @param {number} userId 
 * @returns Array
 */
function getAllProductsOfUser(userId) {
    const db = (isDev) ? new sqlite3.Database(path.resolve(__dirname, 'stock.sqlite')) : new sqlite3.Database(path.resolve(__dirname, '..', 'stock.sqlite'));

    return new Promise((resolve, reject) => {
        db.all("SELECT products.id as id, products.name as name, min_stock,stock ,category_id ,products.created_at as created_at, image_path, categories.name as categoryName FROM products INNER JOIN categories on categories.id = products.category_id WHERE user_id = ?", [userId], (err, rows) => {
            let products = [];
            rows.forEach(function (row) {
                products.push(row);
            });
            db.close();
            return resolve(products);
        });
    });
}

/**
 * Check if the productName is alredy exists in the same category.
 * @param {object} addProductData 
 * @returns Boolean
 */
function validateProduct(addProductData) {
    const db = (isDev) ? new sqlite3.Database(path.resolve(__dirname, 'stock.sqlite')) : new sqlite3.Database(path.resolve(__dirname, '..', 'stock.sqlite'));

    return new Promise((resolve, reject) => {
        db.get(
            `SELECT COUNT(*) as count 
            FROM products where category_id = ? AND name = ? 
            ORDER BY created_at desc`,
            [addProductData.categoryId, addProductData.productName],
            (err, row) => {
                if (err) {
                    db.close();
                    return reject(err);
                }
                if (row.count != 0) {
                    db.close();
                    return resolve(false);
                } else {
                    db.close();
                    return resolve(true);
                }
            });
    })
}

/**
 * Add product in the DB.
 * @param {object} addProductData 
 * @returns Boolean
 */
function addProduct(addProductData) {
    const db = (isDev) ? new sqlite3.Database(path.resolve(__dirname, 'stock.sqlite')) : new sqlite3.Database(path.resolve(__dirname, '..', 'stock.sqlite'));

    const createdAt = new Date().getTime();
    return new Promise((resolve, reject) => {
        db.run(`
            insert into 
            products(name, category_id, min_stock, stock, image_path, created_at) 
            values(?,?,?,?,?,?)`,
            [addProductData.productName, addProductData.categoryId, addProductData.minStock, addProductData.stock, '../img/no-image.jpg', createdAt],
            (err, row) => {
                if (err) {
                    db.close();
                    return resolve(false);
                } else {
                    db.close();
                    return resolve(true);
                }
            });
    })
}

/**
 * Get a product from DB. If dosen't exists return false.
 * @param {number} productId 
 * @returns object, Boolean
 */
function getProduct(productId) {
    const db = (isDev) ? new sqlite3.Database(path.resolve(__dirname, 'stock.sqlite')) : new sqlite3.Database(path.resolve(__dirname, '..', 'stock.sqlite'));

    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM products where id = ?", productId, (err, row) => {
            if (row != null) {
                db.close();
                return resolve(row);
            }
            db.close();
            return resolve(false);
        });
    })
}

/**
 * Delete product fom DB.
 * @param {object} productData 
 * @returns Boolean
 */
function deleteProduct(productData) {
    const db = (isDev) ? new sqlite3.Database(path.resolve(__dirname, 'stock.sqlite')) : new sqlite3.Database(path.resolve(__dirname, '..', 'stock.sqlite'));

    return new Promise((resolve, reject) => {
        // Delete actualImage
        deleteActualImage(productData);

        db.run(`
        DELETE from 
        products 
        WHERE id=?`,
            productData.productId,
            (err, row) => {
                if (err) {
                    db.close();
                    return resolve(false);
                } else {
                    db.close();
                    return resolve(true);
                }
            });
    })
}

/**
 * Update product when user introduce new data of the product.
 * @param {object} productData 
 * @returns Boolean
 */
async function updateProduct(productData) {
    const db = (isDev) ? new sqlite3.Database(path.resolve(__dirname, 'stock.sqlite')) : new sqlite3.Database(path.resolve(__dirname, '..', 'stock.sqlite'));

    // If the argument dosent have imagePath, dosent need update the ImagePath.  
    if (productData.imagePath !== '') {
        deleteActualImage(productData);
        // Save new image
        const filePath = await saveImageFile(path.join(app.getPath('userData'), 'product-image', productData.categoryId), productData);

        // Save to db 
        let data = [productData.stock, productData.minStock, filePath, productData.productId];
        let sql = `UPDATE products
                SET stock=?, min_stock=?, image_path=?
                WHERE id=?`;
        db.run(sql, data);
        db.close();
        return true;
    } else {
        // Save to db
        let data = [productData.stock, productData.minStock, productData.productId];
        let sql = `UPDATE products
        SET stock=?, min_stock=?
        WHERE id=?`;
        db.run(sql, data);
        db.close();
        return true;
    }
}

/**
 * Delete image from directory of category. If the path is default image, don't need to do nothing.
 * @param {object} productData 
 * @returns 
 */
function deleteActualImage(productData) {
    if (productData.actualImage == '../img/no-image.jpg') {
        return;
    } else {
        fs.unlink(productData.actualImage, function (e) {
            if (e) throw e;
        });
    }
}

/**
 * Delete all images of the category when the user delete the category.
 * @param {number} categoryId 
 */
function deleteAllImage(categoryId) {
    fs.rm(path.join(app.getPath('userData'), 'product-image', categoryId), {
        recursive: true,
        force: true
    }, function (e) {
        if (e) throw e;
    });
}

/**
 * Copy image file from the path that selected the user to the directory of the category. Return the path of the new image.
 * @param {string} directoryPath 
 * @param {object} productData 
 * @returns String
 */
function saveImageFile(directoryPath, productData) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
    const randomName = Math.random().toString(36).substring(2, 12);
    const fileName = randomName + path.extname(productData.imagePath);
    const filePath = path.join(directoryPath, fileName);

    fs.copyFile(productData.imagePath, filePath, function (e) {
        if (e) throw e;
    });

    return filePath;
}

/**
 * Update the stock of the product(+1). 
 * @param {object} productData 
 * @returns Boolean
 */
async function incrementProduct(productData) {
    const db = (isDev) ? new sqlite3.Database(path.resolve(__dirname, 'stock.sqlite')) : new sqlite3.Database(path.resolve(__dirname, '..', 'stock.sqlite'));

    // Save to db 
    let data = [productData.id];
    let sql = `UPDATE products 
                    set stock = stock + 1 
                    WHERE id = ?`;
    db.run(sql, data);
    db.close();
    return true;
}

/**
 * Update the stock of the product(-1). 
 * @param {object} productData 
 * @returns Boolean
 */
async function decrementProduct(productData) {
    const db = (isDev) ? new sqlite3.Database(path.resolve(__dirname, 'stock.sqlite')) : new sqlite3.Database(path.resolve(__dirname, '..', 'stock.sqlite'));

    // Save to db 
    let data = [productData.id];
    let sql = `UPDATE products 
    set stock = stock - 1 
                    WHERE id = ?`;
    db.run(sql, data);
    db.close();
    return true;
}

/**
 * Get products that has searched word.
 * @param {object} searchData 
 * @returns Array
 */
function getSearchedProducts(searchData) {
    const db = (isDev) ? new sqlite3.Database(path.resolve(__dirname, 'stock.sqlite')) : new sqlite3.Database(path.resolve(__dirname, '..', 'stock.sqlite'));

    // Search from all products.
    if (searchData.categoryId == 99999) {
        return new Promise((resolve, reject) => {
            db.all("SELECT products.name as name, products.id, products.stock, products.min_stock,user_id, categories.name as categoryName, image_path ,categories.id as categoryId FROM products INNER JOIN categories on categories.id = products.category_id WHERE user_id = ? AND products.name LIKE ? ", [searchData.userId, '%' + searchData.word + '%'], (err, rows) => {
                let products = [];
                rows.forEach(function (row) {
                    products.push(row);
                });
                db.close();
                return resolve(products);
            });
        });
    } else {
    // Search from the category.
        return new Promise((resolve, reject) => {
            db.all("SELECT products.name as name, products.id, products.stock, products.min_stock,user_id, categories.name as categoryName, image_path ,categories.id as categoryId FROM products INNER JOIN categories on categories.id = products.category_id WHERE category_id = ? AND products.name LIKE ? ", [searchData.categoryId, '%' + searchData.word + '%'], (err, rows) => {
                let products = [];
                rows.forEach(function (row) {
                    products.push(row);
                });
                db.close();
                return resolve(products);
            });
        });
    }
}