import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female"],
        message: "{VALUE} is not supported",
      },
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        message: "{VALUE} is not supported",
      },
    },
    address: {
      type: String,
    },
    photo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
