import mongoose from "mongoose";

export const userGender = { male: "male", female: "female" };
export const userRoles = { user: "user", admin: "admin" };
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },

    password: { type: String, required: true },

    phone: { type: String, required: true },

    age: { type: Number, min: 16, max: 60 },

    confirmed: { type: Boolean, default: false },

    gender: {
      type: String,
      enum: Object.values(userGender),
      default: userGender.male,
    },

    role: {
      type: String,
      enum: Object.values(userRoles),
      default: userRoles.user,
    },
    otp:String,
    profileImages:{
    secure_url  :{type:String},
      public_id :{type:String} },
      
    coverImages:[{
    secure_url  :{type:String},
      public_id :{type:String} }],
    
      isDeleted:Boolean,

    deletedBy:{type: mongoose.Schema.Types.ObjectId,ref:"User"}
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
