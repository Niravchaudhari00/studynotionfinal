import { createTransport } from "nodemailer";
import { config } from "dotenv";
config();

const transporter = createTransport({
     service: "gmail",
     host: process.env.SMTP_HOST,
     port: process.env.SMTP_PORT,
     secure: true,
     auth: {
          user: process.env.SMTP_MAIL,
          pass: process.env.SMTP_PASS,
     },
});

export default transporter;
