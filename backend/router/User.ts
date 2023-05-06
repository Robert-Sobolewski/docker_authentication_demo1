import express from "express";
import { Error } from "mongoose";
import User, { IUser, IUserLogin } from "../model/User";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || null;
const EXPIRATION_TIME_MIN = process.env.EXPIRATION_TIME_MIN || null;
let date = new Date();
if (!EXPIRATION_TIME_MIN || !SECRET_KEY)
  throw new Error("EXPIRATION_TIME_MIN or SECRET_KEY not provided !!!");

if (!SECRET_KEY) throw new Error("Secret key not defined !!!");

/**
 * check role middleware
 */

const checkRole = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.redirect("/");
    return res.status(401).send("No token provided");
  }
  jwt.verify(token, SECRET_KEY, (err, decoded: any) => {
    console.log("decoded: " + JSON.stringify(decoded));
    if (err) {
      res.redirect("/");
      return res.status(500).send("Failed to authentication !!!");
    }
    if (decoded.role !== "ADMIN") {
      res.redirect("/");
      return res
        .status(403)
        .send("You are not authorized to access this resource");
    }
    next();
  });
};

const userController = express.Router();

/**
 * register new user endpoint
 */
userController.post(
  "/register",
  async (req: express.Request, res: express.Response) => {
    const newPassword = await bcrypt.hash(
      req.body.password,
      await bcrypt.genSalt(10)
    );
    try {
      const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: newPassword, //req.body.password,
        role: req.body.role!,
      });
      await newUser.save();
      res
        .status(201)
        .json({ success: true, message: "New user created successfully" });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
);

/**
 * login user endpoint
 */
userController.post(
  "/login",
  async (req: express.Request, res: express.Response) => {
    const email: string = req.body.email.toString();
    const password: string = req.body.password.toString();
    try {
      const user = await User.findOne({ email: email });
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword)
        return res
          .status(403)
          .json({ success: false, message: "Invalid password" });
      else {
        /**
         * if user is authenticated, generate access token
         */
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            role: user.role,
          },
          SECRET_KEY,
          {
            expiresIn: EXPIRATION_TIME_MIN + "m", //  60*60*24*365
          }
        );
        res.cookie("user_id", user._id.toString());
        res.cookie("token", token);
        return res
          .status(201)
          .json({ success: true, message: "Login correct", data: token });
      }
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
);

/**
 *  protected content
 */
userController.get(
  "/protected",
  checkRole,
  async (req: express.Request, res: express.Response) => {
    return res.status(200).json({ success: true, message: "Access Permit" });
  }
);

export default userController;
