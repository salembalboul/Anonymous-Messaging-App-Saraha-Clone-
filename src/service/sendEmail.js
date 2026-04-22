import nodemailer from "nodemailer";

export const sendEmail = async ({ to, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      port: 465,
      secure: true,
      service: "gmail",
      auth: {
        user: "salembalboul96@gmail.com",
        pass: "dlarydrbqdozqrzz",
      },
    });

    const mailOptions = {
      from: '"salem 😍" <salembalboul96@gmail.com>',
      to: to,
      subject: "hello",
      text: "hello everybody.",
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.log("email send error", error.message);
    return false;
  }
};
