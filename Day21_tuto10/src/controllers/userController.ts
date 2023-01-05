import exp from "constants";
import { Request, Response, NextFunction } from "express";
import {
  forgetGetService,
  forgetPostService,
  resetGetService,
  resetPostService,
  registerGetService,
  registerPostService,
  loginGetService,
  loginPostService,
  dashboardService
} from "../services/userService.js"
export const dashboard = async(
  req: Request,
  res: Response,
  next:NextFunction
) => {
  dashboardService(req, res, next);
}
export const loginGet = async (
  req: Request,
  res: Response,
  next:NextFunction
) => {
  loginGetService(req, res, next);
}

export const loginPost = async(
  req: Request,
  res: Response,
  next:NextFunction
) => {
  loginPostService(req, res, next);
}
export const registerGet = async(
  req: Request,
  res: Response,
  next:NextFunction
) => {
  registerGetService(req, res, next);
}

export const registerPost = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  registerPostService(req, res, next);
}

export const forgetGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  forgetGetService(req, res, next);
}

export const forgetPost = async(
  req: Request,
  res: Response,
  next:NextFunction
) => {
  forgetPostService(req, res, next);
}

export const resetGet = async(
  req: Request,
  res: Response,
  next:NextFunction
) => {
  resetGetService(req, res, next);
}

export const resetPost = async(
  req: Request,
  res: Response,
  next:NextFunction
) => {
  resetPostService(req,res,next)
}