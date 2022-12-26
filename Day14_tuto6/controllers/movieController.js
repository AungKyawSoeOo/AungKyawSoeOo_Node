import express from "express"
import bodyParser from "body-parser"
import multer from "multer"
import dotenv from "dotenv"
import movieModel from "../models/movieModel.js"


const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().array());

//Getting all movies
export const getAllMovies = (req, res) => {
  movieModel.find({}, (err, foundMovies) => {
    if (!err) {
      res.json(foundMovies);
    } else {
      res.send(err);
    }
  });
}


// Create a movie
export const postMovie = (req, res) => {
  if (!req.body.name ||
    !req.body.year.toString().match(/^[0-9]{4}$/g) ||
    !req.body.rating.toString().match(/^[0-9][\.]?[0-9]?$/g)) {
      res.status(400);
      res.json({message: "Bad Request"});
  } else {
    const name = req.body.name;
    const rating = req.body.rating;
    const year = req.body.year;
    const newMovie= new movieModel({
      name: name,
      rating: rating,
      year:year
    });
    newMovie.save((err) => {
      if (!err) {
        res.json({ message:"Movie added"});
      } else {
        res.status(400);
        res.json(err);
      }
    });
  }
   
}


// Delete all of the movies
export const deleteAllMovies = (req, res) => {
  movieModel.deleteMany((err) => {
    if (!err) {
      res.json({messge:"All movies deleted"});
    } else {
      res.status(400);
      res.json(err);
    }
  }); 
}

// Get a movie with movie name
export const getSpecificMovie = (req, res) => {
  movieModel.findOne({ name: req.params.movieName}, (err, foundMovie) => {
    if (foundMovie) {
      res.json(foundMovie);
    } else {
      res.status(404);
      res.json({message: "No article matched with movie name"});
    }
  })
}

//update a movie with put method
export const updateMovie = (req, res) => {
  movieModel.findOne({ name: req.params.movieName}, (err, foundMovie) => {
    if (foundMovie) {
      movieModel.updateOne({ name: req.params.movieName },
        { name: req.body.name, rating: req.body.rating,year:req.body.year },
        (err) => {
          if (!err) {
            res.json({message: "Updated movie with put method"});
          }
        }
      );
    } else {
      res.status(404);
      res.json({message: "No movie matched with movie name"});
    }
  })
}

// update a movie with patch method
export const patchMovie = (req, res) => {
  movieModel.findOne({ name: req.params.movieName}, (err, foundMovie) => {
    if (foundMovie) {
      movieModel.updateOne(
        { name: req.params.movieName },
        { $set: req.body },
        (err) => {
          if (!err) {
            res.json({ message:"Update Movie with patched method"});
          } else {
            res.status(404);
            res.json(err);
          }
        }
      );
    } else {
      res.status(404);
      res.json({message: "No movie matched with movie name"});
    }
  })
}

//delete a movie with movie name
export const deleteMovie = (req, res) => {

  movieModel.findOne({ name: req.params.movieName}, (err, foundMovie) => {
    if (foundMovie) {
      movieModel.deleteOne(
        {
          name: req.params.movieName
        },
        (err) => {
          if (!err) {
            res.send("Movie Deleted")
          } else {
            res.status(404);
            res.send(err);
          }
        }
      );
    } else {
      res.status(404);
      res.json({message: "No movie matched with movie name"});
    }
  })

  
}