import mongoose from "mongoose";

const revokeTokenModel = new mongoose.Schema(
  {
    jwtId: { type: String, required: true },
    expireAt: { type: String, required: true },
  },
  { timestamps: true }
);

const revokeModel = mongoose.model("Revoke", revokeTokenModel);
export default revokeModel;
