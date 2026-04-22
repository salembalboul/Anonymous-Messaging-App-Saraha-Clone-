import joi from "joi";
import { Types } from "mongoose";

export const customId = (value, helpers) => {
  const data = Types.ObjectId.isValid(value);
  return data ? value : helpers.message("invalid id");
};

export const generalRules = {
  id: joi.string().custom(customId),
  email: joi
    .string()
    .email({ tlds: { allow: true }, minDomainSegments: 2 })
    ,
    files :joi.object({
size:joi.number().positive().required(),
path:joi.string().required(),
filename:joi.string().required(),
destination:joi.string().required(),
mimetype:joi.string().required(),
encoding:joi.string().required(),
originalname:joi.string().required(),
fieldname:joi.string().required(),
 }).messages({
  "any.required":"file is required"
 })
};
