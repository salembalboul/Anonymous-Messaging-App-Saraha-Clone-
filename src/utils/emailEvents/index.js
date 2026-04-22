import { EventEmitter } from "events";
import { generationToken } from "../token/generationToken.js";
import { sendEmail } from "../../service/sendEmail.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on("sendEmail", async (data) => {
  const { email } = data;

  const token = await generationToken({
    payload: { email },
    secretKey: process.env.SIGNATURRE,
    options: { expiresIn: "1h" },
  });

  const link = `http://localhost:3000/users/confirmEmail/${token}`;

  const isSend = await sendEmail({
    to: email,
    html: `<a href="${link}">confirm email</a>`,
  });

  if (!isSend) {
    throw new Error("fail to send email", { cause: 404 });
  }
});


eventEmitter.on("forgetPassword", async (data) => {
  const { email ,otp} = data;

  const isSend = await sendEmail({
    to: email,
    html: `<h1">${otp}</h1>`,
  });

  if (!isSend) {
    throw new Error("fail to send email", { cause: 404 });
  }
});
