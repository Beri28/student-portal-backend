const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const authMiddleware=require('../middlewares/auth')

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/me', userController.getMyProfile);
router.patch('/update-me', userController.updateMyProfile);
router.delete('/delete-me', userController.deleteMyAccount);
router.patch('/update-password', userController.updatePassword);

// Restrict to admin only
// router.use(authController.restrictTo('admin'));
router.use(authMiddleware.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;