import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// creating transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// send mail by taking mailoptions
export const sendEmailReminder = async ({to, subject,text,html}) => {
  const mailOptions = {
    from: `"MedNutri AI" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Email Error:`, error.message);
  }
};
