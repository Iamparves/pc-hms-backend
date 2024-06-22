const catchAsync = require("../../utils/catchAsync");
const { createAdmin } = require("../controllers/user.controller");
const User = require("../models/user.model");

const checkFirstUser = catchAsync(async (req, res, next) => {
  const users = await User.countDocuments();

  if (users === 0) {
    createAdmin(req, res, next);
  } else {
    next();
  }
});

module.exports = checkFirstUser;
