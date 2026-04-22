import CryptoJS from "crypto-js";

export const decrypt = async ({ ciphertext, secretKey } = {}) => {
  return CryptoJS.AES.decrypt(ciphertext, secretKey).toString(
    CryptoJS.enc.Utf8
  );
};
