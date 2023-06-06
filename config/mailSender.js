// import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import Token from "../Models/tokenModel.js";
import dotenv from "dotenv/config";
import Sib from "sib-api-v3-sdk";

export const mailSender = async (data, mailType) => {
  try {
    // let testAccount = await nodemailer.createTestAccount();

    // // create reusable transporter object using the default SMTP transport
    // let mailConfig = nodemailer.createTransport({
    //   host: "smtp.gmail.com",
    //   port: 465,
    //   secure: true, // true for 465, false for other ports
    //   auth: {
    //     user: process.env.VERIFY_MAIL, // generated gmail user
    //     pass: process.env.VERIFY_PASSWORD, // generated gmail password
    //   },
    //   tls: {
    //     ciphers: "SSLv3",
    //   },
    // });

    // NEW METHOD
    //  Include the Brevo library\

    var defaultClient = Sib.ApiClient.instance;
    var apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.YOUR_SENDINBLUE_API_KEY;

    const transEmailApi = new Sib.TransactionalEmailsApi();

    const verifyToken = await bcrypt
      .hashSync(data._id.toString(), 10)
      .replaceAll("/", "");
    const token = new Token({userid: data._id, token: verifyToken});
    await token.save(); //Save token to db

    const content = `<div><h1>Please Verify your mail by clicking this link</h1><br/>
    <a href="http://localhost:3000/verify/${verifyToken}">Click Here</a></div>`;

    const mailOptions = {
      sender: {name: "Admin", email: process.env.VERIFY_MAIL},
      to: [{email: data.email}],
      subject: "Verify your email for JWT App",
      htmlContent: content,
    };

    await transEmailApi.sendTransacEmail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
// await mailConfig.sendMail(mailOptions);
//   } catch (error) {
//     console.log(error);
//   }
// };
