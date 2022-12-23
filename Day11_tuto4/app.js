import express from "express"
import session from "express-session"
import multer from "multer"
import dotenv from "dotenv";
import mongDBSession from "connect-mongodb-session"
import bodyParser from "body-parser"
import bcrypt from "bcryptjs"
const mongDbSession = mongDBSession(session);
const app = express();
dotenv.config();
app.set('view engine', 'pug');
app.set('views', './views');
app.use(multer().array());
app.use(express.json()); 
app.use(express.static("public")); 
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ msg: "This is default CRUD route" });
});

mongoose.connect(process.env.MONGO_URL);

app.listen(PORT, () => {
  console.log("Server listening on port 3000");
});

app.use("/api/movies", movieRouter);

