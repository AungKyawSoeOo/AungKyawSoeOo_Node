import jwt from "jsonwebtoken";
import { Request,Response,NextFunction } from "express";
import cookieParser from "cookie-parser";
import express from "express";
const app = express();
app.use(cookieParser());
export const requireAuth = (req:Request, res:Response, next:NextFunction) => {
  const token = req.cookies.jwt;
  console.log(req.cookies);
  if (token) {
    jwt.verify(token, "my secret", (err:any, decodedToken:any) => {
      if (err) {
        return res.json({data:"not right"})
      } else {
        console.log(decodedToken);
        next();
      }
    })
  } else {
    return res.json({
      data: "You need to login first"
    })
  }
} 