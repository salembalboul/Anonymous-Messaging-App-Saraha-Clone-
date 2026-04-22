import joi from "joi";
import { generalRules } from "../../utils/index.js";
import { userGender } from "../../DB/models/user.model.js";

export const signUpSchema = {
  body: joi.object({
    name: joi.string().alphanum().min(3).max(20).required(),
    email: generalRules.email.required(),
    password: joi.string().required(),
    cPassword: joi.string().valid(joi.ref("password")).required(),
    gender: joi.string().valid(userGender.male, userGender.female).required(),
    age: joi.number().min(18).max(60).positive().required(),
    phone: joi.string().required(),
    // id: generalRules.id.required(),
  }),
   files: joi.object({
    attachment:joi.array().items(generalRules.files.required()).required(),
    attachments:joi.array().items(generalRules.files.required()).required()
   })
};

export const signInSchema = {
  body: joi.object({
    email: generalRules.email.required(),
    password: joi.string().required(),
  }),
};

export const updatePasswordSchema = {
  body: joi.object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().required(),
    cPassword: joi.string().valid(joi.ref("newPassword")).required(),
  }),
};

export const forgetPasswordSchema= {
  body :joi.object({
    email: generalRules.email.required()
  })
}

export const resetPasswordSchema= {
  body :joi.object({
    email: generalRules.email.required(),
    otp:joi.string().required(),
    newPassword: joi.string().required()
  })
}


export const updateProfileSchema= {
  body :joi.object({
    email: generalRules.email,
    name: joi.string().alphanum().min(3).max(20),
    gender: joi.string().valid(userGender.male, userGender.female),
    age: joi.number().min(18).max(60).positive(),
    phone: joi.string(), 
  })
}

export const getProfileDataSchema={
 params:joi.object({
  id:generalRules.id.required()
 }) 
}

export const freezeAccountSchema={
 params:joi.object({
  id:generalRules.id.required()
 }) 
}

export const unFreezeAccountSchema = getProfileDataSchema