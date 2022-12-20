const express = require("express"); 
const app = express();
const multer = require("multer");
const { getMovies, createMovies ,updateMovie} = require("../controllers/movieController.js");
const movieRouter = express.Router();


movieRouter.post("/", createMovies)

movieRouter.get("/", getMovies)

movieRouter.post('/:movieName', updateMovie);

module.exports = { movieRouter: movieRouter};