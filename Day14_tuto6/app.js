import express from "express"
import bodyParser from "body-parser"
import multer from "multer"
import dotenv from "dotenv"
import router from "./routes/movieRouter.js"
import mongoose from "mongoose"
mongoose.set('strictQuery', true);

const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().array());

const movies = [
  {id: 101, name: "Fight Club", year: 1999, rating: 8.1},
  {id: 102, name: "Inception", year: 2010, rating: 8.7},
  {id: 103, name: "The Dark Knight", year: 2008, rating: 9},
  {id: 104, name: "12 Angry Men", year: 1957, rating: 8.9}
];
const PORT = process.env.PORT||3000;
const DB = process.env.MONGO_URL;
mongoose.connect(DB)
  .then(() => {
    console.log("Mongodb connected")
  })
  .catch(() => {
    console.log("Something wrong with database");
  });


app.get("/", (req, res) => {
  res.json(movies);
});
app.use("/", router);
app.listen(PORT, () => {
  console.log("Server listening on port 3000");
})

