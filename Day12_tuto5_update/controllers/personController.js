import express from "express"
import session from "express-session"
import mongoose from "mongoose" 
import dotenv from "dotenv";
import mongDBSession from "connect-mongodb-session"
import multer from "multer"
import pug from "pug"
import bodyParser from "body-parser"
import bcrypt from "bcryptjs"
import PersonModel from "../models/PersonModel.js"
const mongDbSession= mongDBSession(session);
mongoose.set('strictQuery', true);
dotenv.config();
const app = express();
app.set('view engine', 'pug');
app.set('views', './views');
app.use(multer().array());
app.use(express.json()); 
app.use(express.static("public")); 
app.use(bodyParser.urlencoded({ extended: true }));

const DB = process.env.MONGO_URL;



export const isAuth = (req, res, next) => {
  //console.log(req.session.isAuth);
  if (req.session.isAuth) {
    next()
  } else {
    res.redirect("/login");
  }
}

export const registerGet=(req, res) => {
  res.render("register");
}

export const registerPost=async(req, res) => {
  const { username, email, password } = req.body;
  let person = await PersonModel.findOne({ email }); 
  if (person) {
    return res.redirect('/register');
  }
  // we use salt to increase complexity of password and prevent password attack like hash table
  const saltRound = 12;
  const hashedPsw = await bcrypt.hash(password, saltRound);
  person = new PersonModel({
    username: username,
    email: email,
    password: hashedPsw
  }); 
  await person.save();
  res.redirect('/login');
}

//put isAuth
export const dashboard=(req, res) => {
  res.render("dashboard");
}

export const logout= (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  })
}

export const loginGet=(req, res) => {
  res.render("login");
}

export const loginPost= async(req, res) => {
  const { email, password } = req.body;
  const person = await PersonModel.findOne({ email });
  if (!person) {
    return res.redirect("/login"); 
  }
  const isMatch = await bcrypt.compare(password, person.password);
  if (!isMatch) {
    return res.redirect("/login");
  }
  req.session.isAuth = true;
  res.redirect('/dashboard');
}