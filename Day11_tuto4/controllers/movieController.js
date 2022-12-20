const Movie = require("../models/movieModel.js");
const express = require("express");
const app = express();
const multer = require("multer");
const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(multer().array())
app.use(bodyParser.urlencoded({ extended: true }));

const getMovies= async (req, res) => {
  try {
    const result = await Movie.find()
    res.status(201).json({
        message: "success",
        data: result
    })
} catch (err) {
    console.log(err);
}
}

const updateMovie = (req, res) => {
  const requestedMovieName = req.params.movieName;
  console.log(requestedMovieName);
  Movie.updateOne({ name: requestedMovieName },
  {
    name: req.body.name,
    rating: req.body.rating,
    actor: req.body.actor,
    director: req.body.director
  }, (err) => {
    if (!err) {
      res.send("Updated");
    } else {
      console.log("odo");
    }
  }
  )
}

const createMovies = async (req, res) => {
  try {
      const movieData = {
        name: req.body.name,
        rating:req.body.rating,
        actor: req.body.actor,
        director: req.body.director
        
    }
    mov = req.body.name;
    console.log(mov + " added successfully");
      const data = new Movie(movieData)
      const result = await data.save()
      res.status(201).json({
          message: "success",
          data: result
      })
  } catch (err) {
    console.log(err);
  }
}
module.exports={getMovies:getMovies,createMovies:createMovies,updateMovie:updateMovie}
