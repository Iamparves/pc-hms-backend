import mongoose from "mongoose";
import validator from "validator";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
      trim: true,
    },
    email: {
      type: String,
      validate: [validator.isEmail, "Please provide a valid email address!"],
      unique: [true, "Email already exists!"],
      trim: true,
      lowercase: true,
    },
    mobileNo: {
      type: String,
      required: [true, "Mobile number is required!"],
      unique: [true, "Mobile number already exists!"],
      validate: {
        validator: (value) => {
          if (value.length === 0) return true;
          return validator.isMobilePhone(value);
        },
        message: "Please provide a valid contact number",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: [8, "Password must be at least 8 characters!"],
    },
    confirmPassword: {
      type: String,
      required: [true, "Confirm password is required!"],
      validate: {
        validator: function (pswrd) {
          return pswrd === this.password;
        },
        message: "Passwords doesn't match!",
      },
    },
    role: {
      type: String,
      enum: {
        values: ["patient", "admin", "hospital"],
        message: "Role is either: patient, admin, or hospital",
      },
      default: "patient",
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "profileModel",
    },
    profileModel: {
      type: String,
      required: true,
      enum: ["Patient", "Hospital"],
    },
    resetPasswordOTP: String,
    resetPasswordExpire: Date,
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.index({ mobileNo: 1 }, { unique: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  if (this.isNew) return;

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }

  // False means NOT changed
  return false;
};

const User = mongoose.model("User", userSchema);

export default User;
