import { Router } from "express";
const messageRouter = Router();
import * as MS from "./message.service.js";
import { authentication,validation } from "../../middleware/index.js";
import {sendMessaageSchema,getMessageSchema} from "./message.validation.js";

messageRouter.post("/send",validation(sendMessaageSchema),MS.sendMessaage)
messageRouter.get("/",authentication,MS.getAllMessages)
messageRouter.get("/:id",validation(getMessageSchema),authentication,MS.getMessage)

export default messageRouter        