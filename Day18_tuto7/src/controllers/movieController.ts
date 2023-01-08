import { Request, Response, NextFunction } from 'express';
import {
  getMovieService,
  createMovieService,
  findMovieService,
  updateMovieService,
  deleteMovieService,
  findByNameService,
  composeForm,
  contactPage,
  homePage,
  updateMovieServiceGet
} from '../services/movieService.js';
export const updateGet = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  updateMovieServiceGet(req, res, next);
}
export const home = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  homePage(req, res, next);
}
export const compose = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  composeForm(req, res, next);
}
export const contact = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  contactPage(req, res, next);
}
export const getMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  getMovieService(req, res, next);
};

export const createMovie = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  createMovieService(req, res, next);
}

export const findMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  findMovieService(req, res, next);
}

export const updateMovie = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  updateMovieService(req, res, next);
};

export const deleteMovie = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  deleteMovieService(req, res, next);
};

export const findByName = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  findByNameService(req, res, next);
}