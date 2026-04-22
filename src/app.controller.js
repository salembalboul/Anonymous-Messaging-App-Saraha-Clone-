import checkConnectionDb from "./DB/connectionDB.js";
import { globalErrorHandling } from "./middleware/globalErrorHandling.js";
import messageRouter from "./modules/messages/message.controller.js";
import userRouter from "./modules/users/user.controller.js";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve("./src/config/.env") });
import express from "express";
const app = express();
const port = process.env.PORT || 5000;

const bootstrap = () => {
  const whitelist = ["http://localhost:4200", undefined];
  const corsOptions = {
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("not allowed by cors"));
      }
    },
  };
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use("/uploads", express.static("uploads"));
  app.use("/messages", messageRouter);
  app.use("/users", userRouter);
  checkConnectionDb();
  app.use(globalErrorHandling);

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
};

export default bootstrap;
