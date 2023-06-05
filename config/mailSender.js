import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import Token from "../Models/tokenModel.js";

export const mailSender = async (data, mailType) => {
  try {
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let mailConfig = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      // secure: true,  //true for 465, false for other ports
      auth: {
        user: process.env.VERIFY_MAIL, // generated gmail user
        pass: process.env.VERIFY_PASSWORD, // generated gmail password
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    // Token creation
    const verifyToken = await bcrypt
      .hashSync(data._id.toString(), 10)
      .replaceAll("/", "");
    const token = new Token({userid: data._id, token: verifyToken});
    await token.save(); //Save token to db
    const content = `<div><h1>Please Verify your mail by clicking this link</h1><br/>
    <a href="https://authapifrontend.onrender.com/verify/${verifyToken}">Click Here</a></div>`;

    const mailOptions = {
      from: process.env.VERIFY_MAIL,
      to: data.email,
      subject: " Verify your email for JWT App",
      html: content,
    };
    await mailConfig.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
