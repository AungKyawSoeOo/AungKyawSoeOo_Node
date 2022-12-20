require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const multer = require("multer");
const { movieRouter } = require("./routes/movieRoute.js");
const app = express();
app.use(multer().array())
app.use(bodyParser.json())
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

