const { Address } = require('../models');

const getDistricts = async () => {
  const districts = await Address.district.paginate({}, { limit: 100, sortBy: 'name:asc' });
  return districts;
};

const getUpazillasByDistrict = async (district_id) => {
  return await Address.upazilla.paginate({ district_id }, { limit: 100, sortBy: 'name:asc' });
};

const getUnionsByUpazilla = async (upazilla_id) => {
  return await Address.union.paginate({ upazilla_id }, { limit: 100, sortBy: 'name:asc' });
};

module.exports = {
  getDistricts,
  getUpazillasByDistrict,
  getUnionsByUpazilla,
};
