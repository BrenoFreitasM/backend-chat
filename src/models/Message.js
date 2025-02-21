import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    message: String,
    sender: String,
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
