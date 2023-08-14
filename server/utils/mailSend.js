import transporter from "../config/transporter.js";

const mailSender = async (email, title, body) => {
     try {
          let info = await transporter.sendMail({
               from: "nir7308@gmail.com",
               to: `${email}`,
               subject: `${title}`,
               html: `${body}`,
          });
          // console.log(`information => `, info);
          return info;
     } catch (error) {
          console.log("mail send fail");
          console.error(error.message);
     }
};

export default mailSender;
