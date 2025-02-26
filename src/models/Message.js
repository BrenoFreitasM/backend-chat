import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  user: String,
  content: String,
  timestamp: Date,
});

export const Message = mongoose.model("Message", messageSchema);
