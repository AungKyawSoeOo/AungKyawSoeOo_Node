import express from "express";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import user_route from "./routes/userRoute.js"
import mongoose from "mongoose"

mongoose.set('strictQuery', true);

dotenv.config();
const app = express()
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", "./src/public/views")
app.use(express.static("./src/public")); 
const PORT = process.env.PORT||3000;
mongoose.connect(process.env.DATABASE || "")
  .then(() => {
    app.listen(PORT, () => {
      console.log("server listening on port 3000...");
    })
    app.use("/", user_route);
  
  });

