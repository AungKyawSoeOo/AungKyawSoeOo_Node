import express from "express"
import { getAllMovies,postMovie,deleteAllMovies,getSpecificMovie,updateMovie,patchMovie,deleteMovie } from "../controllers/movieController.js";
const router = express.Router();

router.route("/api/movies")
  .get(getAllMovies)
  .post(postMovie)
  .delete(deleteAllMovies)
router.route("/api/movies/:movieName")
  .get(getSpecificMovie)
  .put(updateMovie)
  .patch(patchMovie)
  .delete(deleteMovie)
export default router