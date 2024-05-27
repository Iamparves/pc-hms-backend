import catchAsync from "../../utils/catchAsync.js";
import filterObj from "../../utils/filterObj.js";
import Hospital from "../models/hospital.model.js";

export const updateHospital = catchAsync(async (req, res, next) => {
  const hospitalId = req.user.profile;

  const hospitalData = filterObj(
    req.body,
    "name",
    "address",
    "district",
    "email",
    "photo",
    "description",
    "website"
  );

  const hospital = await Hospital.findByIdAndUpdate(hospitalId, hospitalData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "Hospital updated successfully!",
    data: {
      hospital,
    },
  });
});
