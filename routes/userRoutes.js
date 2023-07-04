const express = require('express');
const multer=require('multer');
const userController = require('../controllers/userController');
const authorisation=require('../controllers/authController');



const router = express.Router();

router.post('/signup',authorisation.signup);
router.post('/login',authorisation.login);
router.get('/logout',authorisation.logout);

router.post('/forgotPassword',authorisation.forgotPassword);
router.patch('/resetPassword/:token',authorisation.resetPassword);


//Protect all routes after this middleware
router.use(authorisation.protect);

router.patch('/updateMyPassword',authorisation.updatePassword)
router.get('/me',userController.getMe,userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe);
router.delete('/deleteMe',userController.deleteMe);

//This will restrict other user from acessing the following routes
router.use(authorisation.restrictTo('admin'));

router
  .route('/') 
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);


module.exports = router;
