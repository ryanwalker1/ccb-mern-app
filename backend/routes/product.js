const express = require('express');
//const authorizeRoles = require('../middlewares/auth/authorizeRoles');

const router = express.Router();

const {getProducts, newProduct, getSingleProduct, updateProductByID, deleteProductByID} = require('../controllers/productController');

const { isUserAuthenicated, authorizeRoles} = require('../middlewares/auth');

//router.route('/products').get(isUserAuthenicated,getProducts);
router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/admin/product/new').post(isUserAuthenicated,authorizeRoles('admin'), newProduct);
router.route('/admin/product/:id').put(isUserAuthenicated,authorizeRoles('admin'), updateProductByID)
router.route('/admin/product/:id').delete(isUserAuthenicated,authorizeRoles('admin'), deleteProductByID);

module.exports = router;