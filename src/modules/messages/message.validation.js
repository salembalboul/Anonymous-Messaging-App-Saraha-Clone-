import joi from "joi";
import { generalRules } from "../../utils/index.js";

export const sendMessaageSchema={
    body:joi.object({
    content: joi.string().min(3).required(),
    userId: generalRules.id.required(),
    }
)}

export const getMessageSchema= {
params:joi.object({
    userId: generalRules.id.required(),
})
}