import mongoose from "mongoose";

export type UserModel = mongoose.Document & {
  username: string;
  password: string;
  avatar: string;
};

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  avatar: String
});

const User = mongoose.model("User", userSchema);
export default User;
