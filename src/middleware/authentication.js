  import revokeModel from "../DB/models/revokeTokenModel.js";
  import userModel from "../DB/models/user.model.js";
  import { verifyToken } from "../utils/index.js";
  export const authentication = async (req, res, next) => {
    const { authentication } = req.headers;

    const [prefix, token] = authentication.split(" ") || [];
    if (!prefix || !token) {
      throw new Error("token not exist", { cause: 404 });
    }

    let signiture;
    if (prefix == "user") {
      signiture = process.env.ACCESS_TOKEN_USER;
    } else if (prefix == "admin") {
      signiture = process.env.ACCESS_TOKEN_ADMIN;
    }
    req.prefix = prefix;

    const decoded = await verifyToken({ token: token, SIGNATURRE: signiture });

    if (!decoded?.email) {
      throw new Error("invalid token");
    }
    const revoked = await revokeModel.findOne({ jwtId: decoded.jwtId });
    if (revoked) {
      throw new Error("please log in again", { cause: 400 });
    }

    const user = await userModel.findOne({ email: decoded.email })
    if (!user) {
      throw new Error("user is not exist", { cause: 400 });
    }
  if(!user?.confirmed || user?.isDeleted ==false){
  throw new Error("please confirm email first or you are freezed")
  }
    
    req.decoded = decoded;
    req.user = user;
    return next();
  };
