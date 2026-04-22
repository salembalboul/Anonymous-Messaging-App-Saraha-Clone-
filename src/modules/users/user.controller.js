import { Router } from "express";
const userRouter = Router();
import * as UC from "./user.service.js";
import {
  validation,
  authentication,
  authorization,
} from "../../middleware/index.js";
import {
  forgetPasswordSchema,
  freezeAccountSchema,
  getProfileDataSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  unFreezeAccountSchema,
  updatePasswordSchema,
  updateProfileSchema, 
} from "../users/user.validation.js";
import { allowedExtensions, MulterHost, MulterLocal } from "../../middleware/multer.js";


userRouter.post("/signUp",  
MulterHost({customPath:"users",customExtensions:[...allowedExtensions.image,...allowedExtensions.pdf]})
.fields([
  {name:"attachment",maxCount:1},
  {name:"attachments",maxCount:2}]),
validation(signUpSchema),UC.signUp);

userRouter.post("/signIn", validation(signInSchema), UC.signIn);
userRouter.get("/confirmEmail/:token", UC.confirmEmail);
userRouter.get("/profile", authentication, UC.getProfile);
userRouter.get("/getProfileData/:id",validation(getProfileDataSchema),UC.getProfileData);
userRouter.post("/logOut", authentication, UC.logOut);
userRouter.post("/refreshToken", UC.refreshToken);
userRouter.patch("/updatePassword", validation(updatePasswordSchema),authentication, UC.updatePassword );
userRouter.patch("/forgetPassword",validation(forgetPasswordSchema),UC.forgetPassword);
userRouter.patch("/resetPassword",validation(resetPasswordSchema),UC.resetPassword);
userRouter.patch("/update",validation(updateProfileSchema),authentication, UC.updateProfile);
userRouter.delete("/freeze/{:id}",validation(freezeAccountSchema),authentication, UC.freezeAccount);
userRouter.delete("/unfreeze/{:id}",validation(unFreezeAccountSchema),authentication, UC.unFreezeAccount);

export default userRouter;  
