const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});
const Post = new mongoose.model("Post", PostSchema);
module.exports= Post;