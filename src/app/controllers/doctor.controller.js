const APIFeaturesAggregation = require("../../utils/apiFeaturesAggregation.js");
const APIFeaturesQuery = require("../../utils/apiFeaturesQuery.js");
const AppError = require("../../utils/appError.js");
const catchAsync = require("../../utils/catchAsync.js");
const filterObj = require("../../utils/filterObj.js");
const Doctor = require("../models/doctor.model.js");
const {
  Speciality,
  getSpecialityIds,
} = require("../models/speciality.model.js");

exports.createDoctor = catchAsync(async (req, res, next) => {
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
    "workExperience",
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

exports.getAllDoctors = catchAsync(async (req, res, next) => {
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

  const result = await features.exec();

  const totalDocs = result[0]?.totalDocs[0]?.count || 0;
  const doctors = result[0]?.paginatedResults || [];

  return res.status(200).json({
    status: "success",
    message: "Doctors found successfully",
    results: doctors.length,
    data: {
      totalDocs,
      doctors,
    },
  });
});

exports.getDoctorById = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.doctorId).populate(
    "hospital specialities"
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

exports.updateDoctor = catchAsync(async (req, res, next) => {
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
    "workExperience",
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

  if (doctorData.specialities) {
    const specialityIds = await getSpecialityIds(doctorData.specialities);
    doctorData.specialities = specialityIds;
  }

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

exports.deleteDoctor = catchAsync(async (req, res, next) => {
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

  return res.status(200).json({
    status: "success",
    message: "Doctor deleted successfully",
    data: null,
  });
});

exports.getSpecialities = catchAsync(async (req, res, next) => {
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

exports.getHospitalDoctors = catchAsync(async (req, res, next) => {
  req.query.hospital = req.user.profile;

  const features = new APIFeaturesQuery(Doctor.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();

  const doctors = await features.query;

  return res.status(200).json({
    status: "success",
    message: "Doctors found successfully",
    results: doctors.length,
    data: {
      doctors,
    },
  });
});
