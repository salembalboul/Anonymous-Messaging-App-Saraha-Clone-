import jwt from "jsonwebtoken";

export const verifyToken = async ({ token, SIGNATURRE } = {}) => {
  return jwt.verify(token, SIGNATURRE);
};
