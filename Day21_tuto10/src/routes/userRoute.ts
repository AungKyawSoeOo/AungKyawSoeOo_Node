import express from "express"
import {
  forgetGet,
  forgetPost,
  resetGet,
  resetPost,
  registerGet,
  registerPost,
  loginGet,
  loginPost,
  dashboard
} from "../controllers/userController.js"

const router = express.Router();
router.route("/")
  .get(dashboard);
router.route("/login")
  .get(loginGet)
.post(loginPost)

router.route("/forgot-password")
  .get(forgetGet)
  .post(forgetPost)

router.route("/reset-password/:_id/:token")
  .get(resetGet)
  .post(resetPost)

router.route("/register")
  .get(registerGet)
  .post(registerPost)

export default router;