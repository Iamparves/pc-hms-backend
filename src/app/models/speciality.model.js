const mongoose = require("mongoose");

const specialitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});

exports.Speciality = mongoose.model("Speciality", specialitySchema);

exports.getSpecialityIds = async function (specialities) {
  const newSpecialities = [];

  await Promise.all(
    specialities.map(async (name) => {
      const existingSpeciality = await Speciality.findOne({
        name: new RegExp(`^${name}$`, "i"),
      });

      if (!existingSpeciality) {
        const newSpeciality = await Speciality.create({ name });
        newSpecialities.push(newSpeciality._id);
      } else {
        newSpecialities.push(existingSpeciality._id);
      }
    })
  );

  return newSpecialities;
};
