const express = require("express"); 
const app = express();
const mongoose = require("mongoose");


const { getPosts, createPost } = require("../controllers/postController.js");
const postRouter = express.Router();

postRouter.route('/')
    .get(getPosts)
    .post(createPost)

module.exports = postRouter;