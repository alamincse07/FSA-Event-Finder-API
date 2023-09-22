const express = require('express');
const addressController = require('../../controllers/address');

const router = express.Router();

router.route('/district').get(addressController.getDistricts);
router.route('/upazilla').get(addressController.getUpazillas);
router.route('/union').get(addressController.getUnions);

module.exports = router;
