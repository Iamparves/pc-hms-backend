import catchAsync from "../../utils/catchAsync.js";
import User from "../models/user.model.js";

export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select(
    "-password -verificationOTP -verificationOTPExpires -resetPasswordOTP -resetPasswordOTPExpires"
  );

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
