const express = require('express');
const { auth, checkOwnership } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user');
const userController = require('../../controllers/user');

const router = express.Router();

router.route('/').get(auth(['admin']), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId/change-role')
  .post(auth(['admin']), validate(userValidation.updateUserRole), userController.updateUserRole);


router
  .route('/:userId')
  .get(auth(), checkOwnership('User', 'id'), validate(userValidation.getUser), userController.getUser)
  .patch(auth(), checkOwnership('User', 'id'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth(['admin']), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
