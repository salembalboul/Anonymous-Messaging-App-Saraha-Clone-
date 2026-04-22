import userModel from "../../DB/models/user.model.js";
import messageModel from "../../DB/models/message.model.js";

//send message
export const sendMessaage = async (req, res, next) => {
  const { content, userId } = req.body;

  const user = await userModel.find({ userId, isDeleted: { $exists: false } });
  if (!user) {
    throw new Error("user is not exist or freezed");
  }

  const message = await messageModel.create({
    content,
    userId,
  });

  return res.status(200).json({ message: "success", message });
};

//get all messages

export const getAllMessages = async (req, res, next) => {
  console.log(req.user._id, typeof req.user._id);

  const user = await messageModel.find({ userId: req.user._id });
  // console.log(user);

  res.status(200).json({ message: "success", user });
};

//get one message

export const getMessage = async (req, res, next) => {
  const { id } = req.params;

  const user = await messageModel.findOne({ userId: req?.user?._id, _id: id }); //populate

  if (!user) {
    throw new Error("message is not exist", { cause: 400 });
  }

  res.status(200).json({ message: "success", user });
};
