import { Message } from "../models/Message.js";

export const saveMessage = async (messageData) => {
  const message = new Message(messageData);
  return await message.save();
};
