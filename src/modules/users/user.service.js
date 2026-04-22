import { customAlphabet, nanoid } from "nanoid";
import userModel, { userRoles } from "../../DB/models/user.model.js";
import {
  eventEmitter,
  generationToken,
  hashing,
  encrypt,
  decrypt,
  compare,
  verifyToken,
} from "../../utils/index.js";
import revokeModel from "../../DB/models/revokeTokenModel.js";
import cloudinary from "../../utils/cloudinary/index.js";

////////////////////////signUp/////////////////////////////////
export const signUp = async (req, res, next) => {
  const { name, email, password, cPassword, gender, age, phone } = req.body;
  

  if(!req?.files){
    throw new Error("file is required")
   }

  const arrPaths = [];
  for (const file of req?.files?.attachments) {
    const {secure_url,public_id} = await cloudinary.uploader.upload(file.path, {
      folder: 'sarahaApp/users/coverImages',
    });
    arrPaths.push({secure_url,public_id});
  }

 const {secure_url,public_id} = await cloudinary.uploader.upload(req?.files?.attachment[0].path, {
      folder: 'sarahaApp/users/profileImages',
    });
  
if ( await userModel.findOne({ email })) {
    throw new Error("user is already exist", { cause: 400 });
  }

  const hash = await hashing({plainText: password , saltRounds: process.env.SALT_ROUNDS,});

  let encryptPhone = await encrypt({plainText: phone , secretKey: process.env.PHONE,});

  eventEmitter.emit("sendEmail", { email });

  const createdUser = new userModel({
    name,
    email,
    password: hash,
    phone: encryptPhone,
    gender,
    coverImages:arrPaths,
    profileImages:{secure_url,public_id},
    age,
  });

  await createdUser.save()

  return res
    .status(200)
    .json({ message: "successfully creating",createdUser });
};

//////////////////////////confirmEmail/////////////////////////////
export const confirmEmail = async (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    throw new Error("token is not found", { cause: 400 });
  }

  const decoded = await verifyToken({
    token: token,
    SIGNATURRE: process.env.SIGNATURRE,
  });
  const user = await userModel.findOne({
    email: decoded.email,
    confirmed: false,
  });
  if (!user) {
    throw new Error("user is not exist", { cause: 400 });
  }
  user.confirmed = true;
  await user.save();

  return res.status(200).json({ message: "confirmed success", user: req.user });
};

////////////////////////signIn/////////////////////////////////
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email, confirmed: true });
  //console.log(user);
  if (!user) {
    throw new Error("this email is not found", { cause: 400 });
  }

  const match = await compare({
    plainText: password,
    cipherText: user.password,
  });

  if (!match) {
    throw new Error("inValid password", { cause: 400 });
  }

  const accsess_token = await generationToken({
    payload: { id: user._id, email },
    secretKey:
      user.role == userRoles.user
        ? process.env.ACCESS_TOKEN_USER
        : process.env.ACCESS_TOKEN_ADMIN,
    options: {
      expiresIn: "1h",
      jwtid: nanoid(),
    },
  });

  const refresh_token = await generationToken({
    payload: { id: user._id, email },
    secretKey:
      user.role == userRoles.user
        ? process.env.REFRESH_TOKEN_USER
        : process.env.REFRESH_TOKEN_ADMIN,
    options: {
      expiresIn: "1y",
      jwtid: nanoid(),
    },
  });
  return res
    .status(200)
    .json({ message: "successfully sign in", accsess_token, refresh_token });
};

//////////////////////////getProfile/////////////////////////////
export const getProfile = async (req, res, next) => {
  let user = req.user;

  let phone = await decrypt({
    ciphertext: user.phone,
    secretKey: process.env.PHONE,
  });

    
  let prefix = req.prefix;
  return res
    .status(200)
    
    .json({ message: "allowed profiles", ...user, phone, role: prefix });
};

//////////////////////////////////logOut/////////////////////////////
export const logOut = async (req, res, next) => {
  const revoking = await revokeModel.create({
    jwtId: req.decoded.jti,
    expireAt: req.decoded.exp,
  });
  return res.status(200).json({ message: "sucess", revoking });
};

//////////////////////////////////refreshToken//////////////////////////////////
export const refreshToken = async (req, res, next) => {
  const { authentication } = req.headers;

  const [prefix, token] = authentication.split(" ") || [];
  if (!prefix || !token) {
    throw new Error("token not exist", { cause: 404 });
  }

  let signiture;
  if (prefix == "user") {
    signiture = process.env.REFRESH_TOKEN_USER;
  } else if (prefix == "admin") {
    signiture = process.env.REFRESH_TOKEN_ADMIN;
  }
  const decoded = await verifyToken({ token: token, SIGNATURRE: signiture });

  if (!decoded?.email) {
    throw new Error("invalid token");
  }
  const revoked = await revokeModel.findOne({ jwtId: decoded.jwtId });
  if (revoked) {
    throw new Error("please log in again", { cause: 400 });
  }

  const user = await userModel.findById(decoded.id).lean();
  if (!user) {
    throw new Error("user is not exist", { cause: 400 });
  }
  const accsess_token = await generationToken({
    payload: { id: user._id, email: decoded.email },
    secretKey:
      user.role == userRoles.user
        ? process.env.ACCESS_TOKEN_USER
        : process.env.ACCESS_TOKEN_ADMIN,
    options: {
      expiresIn: "1h",
      jwtid: nanoid(),
    },
  });

  const refresh_token = await generationToken({
    payload: { id: user._id, email: decoded.email },
    secretKey:
      user.role == userRoles.user
        ? process.env.REFRESH_TOKEN_USER
        : process.env.REFRESH_TOKEN_ADMIN,
    options: {
      expiresIn: "1y",
      jwtid: nanoid(),
    },
  });
  return res.status(200).json({
    message: "successfully refresh token",
    accsess_token,
    refresh_token,
  });
};

//////////////////////////////////updatePassword//////////////////////////////////
export const updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword, cPassword } = req.body;
const valid = !await compare({ plainText: oldPassword, cipherText: req.user.password }) 

  if (!valid) {
    throw new Error("invalid password");
  }
  const hash = await hashing({ plainText: newPassword });

  req.user.password = hash;
  await req.user.save();

   await revokeModel.create({
    jwtId:   req?.decoded?.jti,
    expireAt: req?.decoded?.exp,
  });

  return res.status(200).json({ message: "success", user: req.user });
};

///////////////////////forgetPassword///////////////////////
export const forgetPassword= async(req,res,next)=>{
  const {email} =req.body;

  const user = await userModel.findOne({ email, confirmed: true });

  if (!user) {
    throw new Error("email is not exist", { cause: 400 });
  }
  const otp = customAlphabet('0123456789', 4)();
    eventEmitter.emit("forgetPassword", {otp,email});

const hash =await hashing({plainText:otp});

user.otp =hash;
await user.save()

  return res.status(200).json({ message: "sucess", user });
}

//////////////////////////resetPassword//////////////////////////
export const resetPassword =async (req,res,next)=>{
const {email , otp , newPassword}=req.body;
const user = await userModel.findOne({email , otp:{$exists : true}});
if(!user){
  throw new Error("email is not exist",{cause:400})
}
const comparing =await compare({plainText:otp,cipherText:user.otp});
if(!comparing){
  throw new Error("invalid otp")
}
const hash = await hashing({plainText:newPassword})
const updating= await userModel.updateOne({email},{password:hash ,$unset:{otp:""}})

return res.status(200).json({message:"success",user:updating})
}

//////////////////////////updateProfile//////////////////////////
export const updateProfile =async (req,res,next)=>{
const {email , name , age , phone , gender}=req.body;

if(name){
  req.user.name =name
}
if(age){
  req.user.age= age
}
if(gender){
  req.user.gender= gender
}
if(phone){
  let encryptPhone = await encrypt({
    plainText: phone,
    secretKey: process.env.PHONE,
  });
req.user.phone= encryptPhone
}
if(email){

const user = await userModel.findOne({email });
if(user){
  throw new Error("email already exist",{cause:400})
}
  eventEmitter.emit("sendEmail", { email });

  req.user.email=email
}
  req.user.confirmed= false

await req.user.save()
return res.status(200).json({message:"success",user:req.user})
}

//////////////////////////getProfileData//////////////////////////
export const getProfileData=async (req,res,next) => {
const {id} =req.params;
const user= await userModel.findById(id).select("-password -role -confirmed -phone -createdAt -updatedAt");
if(!user){throw new Error("user is not exist")};

return res.status(200).json({message:"success",user})

}

//////////////////////////freezeAccount//////////////////////////
export const freezeAccount= async(req,res,next)=>{
const {id} =req.params;

if(id && req.user.role !==userRoles.admin){
  throw new Error ("you can not freeze this account")
}

const user = await userModel.updateOne(
  {_id:id || req.user._id ,
    isDeleted:{$exists:false}}
  ,{
    isDeleted: true,
    deletedBy: req.user._id,
    $inc:{ __v:1 }
  }
  )  
user.matchedCount ? res.status(200).json({message:"success",user}):res.status(404).json({message:"fail to freeze"})
}

//////////////////////////unFreezeAccount//////////////////////////
export const unFreezeAccount= async(req,res,next)=>{
const {id} =req.params;

if(id && req.user.role !==userRoles.admin){
  throw new Error ("you can not freeze this account")
}

const user = await userModel.updateOne(
  {_id:id || req.user._id ,
    isDeleted:{$exists:true}}
  ,{
    $unset: {isDeleted:"",deletedBy:""},
    $inc:{ __v:1 }
  }
  )  
user.matchedCount ? res.status(200).json({message:"success"}):res.status(404).json({message:"user not exist"})
}