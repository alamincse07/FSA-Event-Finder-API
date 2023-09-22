const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { tokenService } = require('../services');
const { userService } = require('../services');
const { tokenTypes } = require('../config/tokens');
const mongoose = require('mongoose');

const ROLES = require('../config/roles');

const authenticateUser = async (req) => {
  const authHeader = req.headers && req.headers.authorization;

  const token = authHeader?.split(' ')[1] || '';

  if (!token || !authHeader) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authorization required');
  }
  try {
    const tokenDoc = await tokenService.verifyToken(token, tokenTypes.ACCESS);

    if (!tokenDoc) {
      throw new Error('Token Mismatch');
    }
    const user = await userService.getUserById(tokenDoc.user);

    if (!user) {
      throw new Error('Invalid Authentication Token');
    }
    return { ...user._doc, id: user._id.toString() };
  } catch (e) {
    throw new ApiError(httpStatus.UNAUTHORIZED, e.message);
  }
};

const auth =
  (allowedRoles = []) =>
  async (req, res, next) => {
    try {
      const user = await authenticateUser(req);
      req['user'] = user;

 
      if (allowedRoles.length) {
        if (!allowedRoles.includes(user.role)) {
          throw new ApiError(httpStatus.FORBIDDEN, 'Not Authorized to perform this action');
        }
      }
      return next();
    } catch (err) {
      next(err);
    }
  };

const checkOwnership = (modelName, fieldName) => {
  return async (req, res, next) => {
    try {
      //  console.log(`${modelName.toLowerCase()}Id`);
      const { user } = req; // Assuming the user id in the request after authentication
      const resourceId = req.params[`${modelName.toLowerCase()}Id`]; // Assuming the resource ID is passed in the URL params

      if (!mongoose.Types.ObjectId.isValid(resourceId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid ID request');
      }

      if (user.role !== ROLES.ADMIN) {
        const Model = mongoose.model(modelName);

        // Fetch the resource from your database or data source
        const resource = await Model.findById(resourceId);

        if (!resource) {
          throw new ApiError(httpStatus.BAD_REQUEST, `${modelName} not found`);
        }
        if (!resource[fieldName]) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid ID request');
        }

        // Check if the user is the owner of the resource or has the necessary permissions
        if (resource[fieldName].toString() !== user.id.toString()) {
          throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to perform this action');
        }
      }
      // If the user is the owner/admin, they can proceed
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = {
  auth,
  checkOwnership,
};
