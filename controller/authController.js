import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {mailSender} from "../config/mailSender.js";
import Token from "../Models/tokenModel.js";

// Register User
export const registerUser = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "true");
  const {user, email, password} = req.body;

  // check if  email already exists
  const userExists = await User.findOne({email});
  if (userExists) {
    res.status(200).send({
      success: false,
      msg: "User with this email already exists",
    });
  } else {
    try {
      // before saving password we hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newEntry = await User.create({
        user: user,
        email: email,
        password: hashedPassword,
      });
      await mailSender(newEntry, "Verify-mail"); // NodeMailer
      // const newEntry = new User(req.body);
      // newEntry.save();
      // console.log(newEntry);
      return res.status(200).send({
        success: true,
        msg: "Registration Successful  Verification Mail has been sent to your email",
      });
    } catch (error) {
      return res.status(400).send({success: false, msg: error});
    }
  }
};

// -------------------------------LOGIN-------------------

export const loginUser = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "true");
  const {email, password} = req.body;
  try {
    const user = await User.findOne({email});
    if (user) {
      if (user && (await bcrypt.compare(password, user.password))) {
        if (user.isVerified) {
          const tokenData = {
            _id: user._id,
            user: user.user,
            email: user.email, //the way it is stored in MongoDB
          };
          // JWT
          const token = jwt.sign(tokenData, process.env.JWT_KEY, {
            expiresIn: "30d",
          });
          return res
            .status(200)
            .send({success: true, msg: "Login Successful", token});
        } else {
          return res.send({
            success: false,
            msg: "Email not Verified, Please check your Inbox",
          });
        }
      } else {
        return res.send({success: false, msg: "Invalid Credentials"});
      }
      // return res.status(200).send({success: true, msg: "Login Successful",{}});
    } else {
      return res.send({success: false, msg: "Invalid Credentials"});
    }
  } catch (error) {
    return res.send(error);
  }
};

// Get Token Details-------------
export const userData = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "true");
  try {
    res.status(200).send({success: true, data: req.body.user}); //data coming from authMiddleware after jwt verify
  } catch (error) {
    res.status(400).send(error);
  }
};

// Update password

export const updateUser = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "true");
  const {updateUser} = req.body;
  const email = updateUser.email;
  const user = await User.findOne({email});
  if (user && (await bcrypt.compare(updateUser.cupassword, user.password))) {
    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(updateUser.password, salt);
    try {
      const updatedUser = await User.findByIdAndUpdate(user._id, {
        name: updateUser.name,
        email: updateUser.email,
        password: hashedPassword,
      });

      if (!updatedUser) {
        return res.status(400).send({msg: "Something went wrong!"});
      }

      return res
        .status(200)
        .send({success: true, msg: "Password updated Successfully"});
    } catch (error) {
      return res.status(500).send({msg: "Internal Server Error"});
    }
  } else {
    return res.send({msg: " No user or Something went wrong!"});
  }
};

// After Verification of Email
export const verifyMail = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "true");

  try {
    const tokenDetail = await Token.findOne({token: req.body.token}); //token db userID
    if (tokenDetail) {
      await User.findOneAndUpdate({_id: tokenDetail.userid, isVerified: true}); //User id and tokenDB userId if matches
      await Token.findOneAndDelete({token: req.body.token}); //Delete Token from db after email verification

      res.send({success: true, msg: "Email Verified Successfully"});
    } else {
      res.send({success: false, msg: "Invalid Token"});
    }
  } catch (error) {
    res.send({success: false, msg: "Invalid Token"});
  }
};
