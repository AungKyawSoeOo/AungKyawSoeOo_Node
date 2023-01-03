import { Request, Response } from "express";
import {
  registerService, loginService, logoutService
} from "../services/authServiece.js";

export const register = async(
  req: Request,
  res:Response
) => {
  registerService(req, res);
}

export const login = async(
  req: Request,
  res: Response
) => {
  loginService(req, res);
}

export const logout = (req: any, res: Response) => {
  logoutService(req, res);
}