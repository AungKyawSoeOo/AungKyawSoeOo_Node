const express = require("express"); 

const { getPosts, createPost} = require("../controllers/postController.js");
const postRouter = express.Router();
const pRouter = express.Router();

postRouter.route('/')
    .get(getPosts)
    .post(createPost)


module.exports = { postRouter: postRouter };