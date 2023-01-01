import express from 'express';
import { getMovies, createMovie, findMovie, updateMovie, deleteMovie, findByName,updateGet } from '../controllers/movieController.js';
import { body, check } from 'express-validator';

const router = express.Router();



router
  .route("/")
  .get(getMovies)
  .post(
    [
      check("name").notEmpty().withMessage("Movie name must not be empty"),
      check("rating")
      .matches(/^[0-9][\.]?[0-9]?$/g).withMessage("Rating should be int or float (eg. 1 , 1.5)"),
      check("year")
      .matches(/^[0-9]{4}$/g).withMessage("Year must be 4 numbers"),
      check("review").notEmpty().withMessage("Review must not be empty")

      //chaining
      //check("year").notEmpty().withMessage("Year must not be empty")
      //.matches(/^[0-9]{4}$/g).withMessage("Year must be 4 numbers"),
    ],
    createMovie);




router
  .route("/:id/update")
  .get(updateGet);

router
  .route("/:id")
  .get(findMovie)
  .put(
    [
      check("name").notEmpty().withMessage("Movie name must not be empty"),
      check("rating")
      .matches(/^[0-9][\.]?[0-9]?$/g).withMessage("Rating should be int or float (eg. 1 , 1.5)"),
      check("year")
      .matches(/^[0-9]{4}$/g).withMessage("Year must be 4 numbers"),
      check("review").notEmpty().withMessage("Review must not be empty")
    ],
    updateMovie)
  .delete(deleteMovie);

  router
  .route("/search?name=:name")
  .post(findByName)
export default router;