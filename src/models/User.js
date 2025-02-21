import mongoose from "mongoose";

// Schema de usuário (exemplo)
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export default mongoose.model("User", userSchema);