const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { addressService } = require('../services');

const getDistricts = catchAsync(async (req, res) => {
  const data = await addressService.getDistricts();

  console.log(data);
  res.status(httpStatus.OK).send(data);
});

const getUpazillas = catchAsync(async (req, res) => {
  const data = await addressService.getUpazillasByDistrict(req.query.districtId);
  res.status(httpStatus.OK).json(data);
});

const getUnions = catchAsync(async (req, res) => {
  const data = await addressService.getUnionsByUpazilla(req.query.upazillaId);
  res.status(httpStatus.OK).send(data);
});

module.exports = {
  getDistricts,
  getUnions,
  getUpazillas,
};
