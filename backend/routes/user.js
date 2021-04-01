const express  = require('express');

const router = express.Router();



const { isUserAuthenicated, authorizeRoles} = require('../middlewares/auth');




const {registerUser, userLogin, logout, getUserProfile, updateProfile, allUsers} = require('../controllers/userController');


router.route('/register/').post(registerUser);
router.route('/login/').post(userLogin);
router.route('/logout').get(logout);
router.route('/me').get(isUserAuthenicated, getUserProfile);
router.route('/me/update').put(isUserAuthenicated, updateProfile);
router.route('/admin/users').get(isUserAuthenicated, authorizeRoles('admin'), allUsers);


module.exports = router;


