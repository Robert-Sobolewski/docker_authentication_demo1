import { Document, Schema, ObjectId, Model } from "mongoose";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
export interface IUser extends Document {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string;
  role?: "USER" | "ADMIN" | "OWNER";
}
export interface IUserLogin extends Omit<IUser, "username"> {}

const userSchema: Schema = new Schema({
  username: {
    type: String,
    minLength: 3,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "USER",
  },
});

// userSchema.pre<IUser>("save", async function save(next: any) {
//   try {
//     const user = this;
//     const SALT = await bcrypt.genSalt(10);
//     if (!user.isModified) {
//       const hash = await bcrypt.hash(this.password, SALT);
//       user.password = hash;
//       next();
//     } else {
//       next();
//     }
   
//   } catch (error) {
//     return next(error);
//   }
// });
// create method to compare password with the hashed one

// userSchema.methods.isValidPassword = async function (password: string) {
//   try {
//    const s = await bcrypt.genSalt(10);
//     return await bcrypt.compare(password, this.password);
//   } catch (err: any) {
//     throw new Error(err.message);
//   }
// };

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
