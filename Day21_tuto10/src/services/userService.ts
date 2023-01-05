import { Request, Response, NextFunction } from "express";
import { hashSync,compareSync } from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"
import dotenv from "dotenv";

dotenv.config();
const jwtSecret = process.env.jwtSecretOrKey;

export const dashboardService = async(
  req: Request,
  res: Response,
  next:NextFunction
) => {
  res.render("dashboard");
}

export const registerGetService = async(
  req: Request,
  res: Response,
  next:NextFunction
) => {
  res.render("register");
}
export const registerPostService = async(
  req: Request,
  res: Response,
  next:NextFunction
) => {
  const email = req.body.email;
  const password = req.body.password;
  let exist = await User.findOne({ email });
  if (exist) {
    res.redirect("/register");
  }
  const user = new User({
    email: email,
    password: hashSync(password, 10)
  })
  user.save((err, user) => {
    if (!err) {
      res.render("login",{msg:""});
    }
  })
}

export const loginGetService = async(
  req: Request,
  res: Response,
  next:NextFunction
) => {
  res.render("login",{msg:""})
}

export const loginPostService = async(
  req: Request,
  res: Response,
  next:NextFunction
) => {
  const user: any = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send("User not found");
      
    }

    if (!compareSync(req.body.password, user.password)) {
      return res.render("login",{msg:""})
  }
  res.render("landing");

}
export const forgetGetService = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.render("forgot-password");
}

export const forgetPostService = async(
  req: Request,
  res: Response,
  next:NextFunction
) => {
  const { email } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    res.render("forgot-password");
  } 
  else {
    const secret = jwtSecret + user.password;
    const payload = {
      email: user.email,
      _id:user._id
    }
    const token = jwt.sign(payload, secret, { expiresIn: '15m' });
    const link = `http://localhost:3000/reset-password/${user._id}/${token}`;
    
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Email,
        pass: process.env.Password
      }
    });
    
    console.log(link);
    let mailOptions = {
      from: "testingakso786@gmail.com",
      to: user.email,
      subject: "Password reset link",
      text:link
      
    }
    
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email send")
      }
    })
    res.send("Check your email to get password reset link");
   

  }

   
  

}

export const resetGetService = async(
  req: Request,
  res: Response,
  next:NextFunction
) => {
  const { _id, token } = req.params;
  const user = await User.findOne({ _id });

  if (!user) {
    res.send("Invalid Id");
  }
 else{
    console.log(user.email)
    const secret = jwtSecret + user.password;
    try {
      const payload = jwt.verify(token, secret);
      res.render("reset-password", { email: user.email,_id:_id,token:token });
    } catch (error) {
      console.log(error);
      res.send("Some Error")
    }
    
  }
  
}

export const resetPostService = async(
  req: Request,
  res: Response,
  next:NextFunction
) => {
  const { _id, token } = req.params;
  const { password, password2 } = req.body;
  const user = await User.findOne({ _id });

  if (!user) {
    res.send("Invalid Id");
  }
  else {
    const secret = jwtSecret + user.password;
    try {
      const payload = jwt.verify(token, secret);
      user.password = hashSync(password, 10);
      console.log(password);
      if (password.length == 0) {
        res.redirect(`/`);
      }
      const usernew=user.save();
      res.render("login",{msg:"Login with new password"});
    } catch (error) {
      console.log(error);
      res.send("Some error");
    }
  }
}