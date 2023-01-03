import express from "express";
import { body } from "express-validator";
import { register, login, logout } from "../controllers/authController.js";

const router = express.Router();
router
  .route("/login")
  .post([
    body("email").notEmpty().withMessage("Email must not be empty"),
    body("password").notEmpty().withMessage("Password must not be empty")
  ], login);

router
  .route("/register")
  .post([
    body("email").notEmpty().withMessage("Email must not be empty"),
    body("password").notEmpty().withMessage("Password must not be empty")
  ], register);

router
  .route("/logout")
  .post([], logout)
export default router;
