import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    user: {
      type: String,
      trim: true, //after submitting a form it will remove space start & end of the text.
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    isVerified: {
      //verify users
      type: Boolean,
      default: false,
    },
  },
  {timestamps: true}
);

const User = mongoose.model("user", userSchema); //User always capital
export default User;
