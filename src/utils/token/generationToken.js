import jwt from "jsonwebtoken";

export const generationToken = async ({ payload, secretKey, options } = {}) => {
  return jwt.sign(payload, secretKey, options);
};
