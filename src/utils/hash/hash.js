import bcrypt from "bcrypt";
export const hashing = async ({
  plainText,
  saltRounds = process.env.SALT_ROUNDS,
} = {}) => {
  return bcrypt.hashSync(plainText, Number(saltRounds));
};
