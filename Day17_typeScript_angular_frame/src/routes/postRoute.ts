import express from 'express';
import { getPosts, createPost, findPost, updatePost, deletePost, findByName } from '../controllers/postController.js';
import { body } from 'express-validator';

const router = express.Router();

router
  .route("/")
  .get(getPosts)
  .post(
    [
      body("title").notEmpty().withMessage("Title must not be empty"),
      body("description").notEmpty().withMessage("Description must not be empty")
    ],
    createPost);

router
  .route("/search")
  .post(findByName)

router
  .route("/:id")
  .get(findPost)
  .put(
    [
      body("title").notEmpty().withMessage("Title must not be empty"),
      body("description").notEmpty().withMessage("Description must not be empty"),
    ],
    updatePost)
  .delete(deletePost)
export default router;