import express, { Request, Response, NextFunction } from "express";
import Movie from "../models/movieModel.js"
import { movieCreate } from "../interfaces/movieInterface.js";
import {validationResult} from "express-validator"
import { logger } from "../logger/logger.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser"
import { read } from "fs";
const app = express();

app.use(cookieParser());
export const homePage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.render("welcome")
}

export const composeForm = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let formData = req.cookies.formData;
  res.render("compose",{formData:formData});
}

export const contactPage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  res.render("contact");
}

/**
 * get movies service.
 * @param req 
 * @param res 
 * @param next 
 */

export const getMovieService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let condition: any = { deleted_at: null };
    const movies = await Movie.find(condition);
    //res.json({
    //  data: movies,
    //  status: 1
    //});
   
    res.render("home",{movies:movies});
  }catch (err: any) {
    logger.error('GET Post API Error');
    logger.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(403).json({ message: 'GET Post API Error', status: 1 });
  }
}


/**
 * create movie service
 * @param req 
 * @param res 
 * @param next 
 */

export const createMovieService = async (req: Request, res: Response, next: NextFunction) => { 
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let user = {
        name: req.body.name,
        rating: req.body.rating,
        year: req.body.year,
        review:req.body.review
      }
      console.log(user);
      //const error: any = new Error("Validation failed!");
      //error.data = errors.array();
      //error.statusCode = 422;
      //console.log(error);
      //throw error;
      return res.render("compose", {
        errors: errors.array(),
        user:user
      });
    }
    const movieInsert: movieCreate = {
      name: req.body.name,
      rating: req.body.rating,
      year: req.body.year,
      review:req.body.review
    }
  
    const movie = new Movie(movieInsert);
    const result = await movie.save();
    //res
    //  .status(201)
    //  .json({ message: "Created Successfully!", data: result, status: 1 });
    res.redirect("/api/movies");
  } catch(err:any) {
    //logger.error('Create Post API Error');
    //logger.error(err);
    //if (!err.statusCode) {
    //  err.statusCode = 500;
    //}
    //res.status(403).json({ message: 'Create Post API Error', status: 1 });
    res.redirect("/compose");
  }
}

/**
 * get movie data with Id service.
 * @param req 
 * @param res 
 * @param next 
 */
export const findMovieService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) { 
    try {
      const movie = await Movie.findById(req.params.id);
      if (!movie) {
        const error: any = Error("Not Found!");
        error.statusCode = 404;
        throw error;
      }
      res.render("movie", {
        id: movie._id,
        name: movie.name,
        rating: movie.rating,
        year: movie.year,
        review:movie.review
      })
    } catch (err: any) {
      logger.error('GET Post with id API Error');
      logger.error(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      res
        .status(404)
        .json({ message: "GET Post with id API Error", status: 0 });
    }
  }else{
    findByNameService(req, res, next);
  }
  
}
export const updateMovieServiceGet = async(
  req: any,
  res: Response,
  next: NextFunction
) => {
  const movie: any = await Movie.findById(req.params.id);
  if (!movie) {
    return res.render("error");
  }
  //
  try {
    const errors = req.query.errors;
    const errorArray = JSON.parse(decodeURIComponent(errors));
    res.render("update", { movie: movie, errors: errorArray });
  } catch {
    res.render("update", { movie: movie });
  }

 
}

/**
 * update post with id.
 * @param req 
 * @param res 
 * @param _next 
 */
export const updateMovieService = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //const error: any = new Error("Validation failed!");
      //error.data = errors.array();
      //error.statusCode = 422;
      //throw error;
      return res.redirect(`/api/movies/${req.params.id}/update?errors=${encodeURIComponent(JSON.stringify(errors.array()))}`);
    }
    const movie: any = await Movie.findById(req.params.id);
    if (!movie) {
      const error: any = new Error("Not Found!");
      error.statusCode = 404;
      throw error;
    }
    movie.name = req.body.name;
    movie.rating = req.body.rating;
    movie.year = req.body.year;
    movie.review=req.body.review
    const result = await movie.save();
    //res.json({ message: "Updated Successfully!", data: result, status: 1 });
    res.redirect("/api/movies");
  } catch (err: any) {
    const movie: any = await Movie.findById(req.params.id);
    //logger.error('Update Movie API Error');
    //logger.error(err);
    //if (!err.statusCode) {
    //  err.statusCode = 500;
    //}
    //res.status(403).json({ data: 'Update Movie API Error', status: 1 });
    res.redirect("/api/movies/"+movie._id+"/update")
  }
};


/**
 * delete post with id.
 * @param req
 * @param res 
 * @param next 
 */
export const deleteMovieService = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const movie: any = await Movie.findById(req.params.id);
    if (!movie) {
      const error: any = new Error("Not Found!");
      error.statusCode = 404;
      throw error;
    }
    movie.deleted_at = new Date();
    await movie.save();
    res.redirect("/api/movies");
  } catch (err: any) {
    logger.error('Delete Movie API Error');
    logger.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(403).json({ data: 'Delete Movie API Error', status: 1 });
  }
};

/**
 * find title with keyword service.
 * @param req 
 * @param res 
 * @param _next 
 */
export const findByNameService = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const query = req.query.name;
    let condition: any = { name: { '$regex': query, '$options': 'i' }, deleted_at: null };
    const movies = await Movie.find(condition);
    //res.json({ data: movies, status: 1 });
 
    if (movies.length==0) {
      res.render("error");
    }
    res.render("byname", { movies: movies });
  } catch (err: any) {
    logger.error('Search Movie with title keyword API Error');
    logger.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(403).json({ data: 'Search Movie with title keyword API Error', status: 1 });
  }
}