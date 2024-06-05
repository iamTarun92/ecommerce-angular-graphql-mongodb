import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "pandeyt152@gmail.com",
      pass: "eihwotgponlwkfnc",
    },
  });

  const mailOptions = {
    from: "pandeyt152@gmail.com",
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, async (error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + data.response);
    }
  });
};

export { sendEmail };
