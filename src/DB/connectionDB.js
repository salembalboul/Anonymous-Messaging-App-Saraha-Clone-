import mongoose from "mongoose";
const checkConnectionDb = async () => {
  await mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("success to connect");
    })
    .catch((error) => {
      console.log("fail to connect", error);
    });
};
export default checkConnectionDb;
