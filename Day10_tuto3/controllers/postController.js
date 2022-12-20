const Post = require("../models/postModel.js")
const express = require("express");
const app = express();
const bodyParser = require("body-parser")
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }));
const getPosts = async (req, res) => {
  try {
    const result = await Post.find()
    res.status(201).json({
        message: "success",
        data: result
    })
} catch (err) {
    console.log(err);
}
}



const createPost = async (req, res) => {
  try {
      const postData = {
        name: req.body.name,
        author:req.body.author,
        description: req.body.description,
        year: req.body.year
        
    }
    author = req.body.author;
    console.log(author + " added successfully");
      const data = new Post(postData)
      const result = await data.save()
      res.status(201).json({
          message: "success",
          data: result
      })
  } catch (err) {
    console.log(err);
  }
}
module.exports={getPosts:getPosts,createPost:createPost}

