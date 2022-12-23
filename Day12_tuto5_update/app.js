import express from "express"
import session from "express-session"
import mongoose from "mongoose" 
import dotenv from "dotenv"
import mongDBSession from "connect-mongodb-session"
import multer from "multer"
import pug from "pug"
import router from "./routes/personRouter.js"
import bodyParser from "body-parser"
import bcrypt from "bcryptjs"
import PersonModel from "./models/PersonModel.js"
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
mongoose.connect(DB)
  .then(() => {
    console.log("Mongodb connected")
  })
  .catch(() => {
    console.log("Something wrong with database");
  });
  const store = new mongDbSession({
    uri: DB,
    // This collection will create under db as session collection
    collection:"mySession"
    })
  app.use(session({
    secret: 'key that will sign cookie',
    resave: false,
    saveUninitialized: false,
    store: store
  }));
app.get("/", (req, res) => {
  res.render("landing");
});

app.use("/", router);
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});