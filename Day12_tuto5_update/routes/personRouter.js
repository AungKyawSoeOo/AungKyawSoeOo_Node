import express from "express"
import { registerGet, registerPost, dashboard, logout, loginGet, loginPost,isAuth } from "../controllers/personController.js"
const router = express.Router();

router.route("/login")
  .get(loginGet)
  .post(loginPost)
router.route("/register")
  .get(registerGet)
  .post(registerPost)
router.get("/dashboard",isAuth, dashboard)
router.post("/logout", logout)

export default router

