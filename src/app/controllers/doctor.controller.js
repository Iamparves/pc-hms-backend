import APIFeaturesAggregation from "../../utils/apiFeaturesAggregation.js";
import AppError from "../../utils/appError.js";
import catchAsync from "../../utils/catchAsync.js";
import filterObj from "../../utils/filterObj.js";
import Doctor from "../models/doctor.model.js";
import Speciality, { getSpecialityIds } from "../models/speciality.model.js";

export const createDoctor = catchAsync(async (req, res, next) => {
  const doctorData = filterObj(
    req.body,
    "name",
    "photo",
    "qualifications",
    "about",
    "specialities",
    "designation",
    "languages",
    "institute",
    "department",
    "appointmentNo",
    "chamberTime",
    "offDays",
    "floorNo",
    "roomNumber",
    "branchNames",
    "bmdcNo",
    "consulatationFee",
    "phone",
    "feesToShowReport"
  );

  const specialityIds = await getSpecialityIds(doctorData.specialities);

  doctorData.hospital = req.user.profile;
  doctorData.specialities = specialityIds;

  const doctor = await Doctor.create(doctorData);

  res.status(201).json({
    status: "success",
    message: "Doctor created successfully",
    data: {
      doctor,
    },
  });
});

export const getAllDoctors = catchAsync(async (req, res, next) => {
  const features = new APIFeaturesAggregation(Doctor, req.query)
    .filter()
    .hospitalFilter()
    .districtFilter()
    .specialityFilter()
    .dateFilter()
    .nameFilter()
    .sort()
    .limitFields()
    .paginate();

  const doctors = await features.exec();

  return res.status(200).json({
    status: "success",
    message: "Doctors found successfully",
    results: doctors.length,
    data: {
      doctors,
    },
  });
});

export const getDoctorById = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.doctorId).populate(
    "hospital"
  );

  if (!doctor) {
    return next(new AppError("Doctor not found", 404));
  }

  return res.status(200).json({
    status: "success",
    message: "Doctor found successfully",
    data: {
      doctor,
    },
  });
});

export const updateDoctor = catchAsync(async (req, res, next) => {
  const doctorData = filterObj(
    req.body,
    "name",
    "photo",
    "qualifications",
    "about",
    "specialities",
    "designation",
    "languages",
    "institute",
    "department",
    "appointmentNo",
    "chamberTime",
    "offDays",
    "floorNo",
    "roomNumber",
    "branchNames",
    "bmdcNo",
    "consulatationFee",
    "phone",
    "feesToShowReport"
  );

  const doctor = await Doctor.findById(req.params.doctorId);

  if (!doctor) {
    return next(new AppError("Doctor not found", 404));
  }

  if (doctor.hospital.toString() !== req.user.profile.toString()) {
    return next(
      new AppError("You are not authorized to update this doctor", 403)
    );
  }

  const updatedDoctor = await Doctor.findByIdAndUpdate(
    req.params.doctorId,
    doctorData,
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json({
    status: "success",
    message: "Doctor updated successfully",
    data: {
      doctor: updatedDoctor,
    },
  });
});

export const deleteDoctor = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.doctorId);

  if (!doctor) {
    return next(new AppError("Doctor not found", 404));
  }

  if (doctor.hospital.toString() !== req.user.profile.toString()) {
    return next(
      new AppError("You are not authorized to delete this doctor", 403)
    );
  }

  await Doctor.findByIdAndDelete(req.params.doctorId);

  return res.status(204).json({
    status: "success",
    message: "Doctor deleted successfully",
    data: null,
  });
});

export const getSpecialities = catchAsync(async (req, res, next) => {
  const specialities = await Speciality.find();

  return res.status(200).json({
    status: "success",
    message: "Specialities found successfully",
    results: specialities.length,
    data: {
      specialities,
    },
  });
});
