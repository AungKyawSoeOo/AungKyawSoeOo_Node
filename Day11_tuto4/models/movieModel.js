const mongoose = require("mongoose");
const MovieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: true
  },
  actor: {
    type: String,
    required: true
  },
  director: {
    type:String,
    required: true
  }
}, {
  timestamps: true
});
const Movie = new mongoose.model("Movie", MovieSchema);
module.exports = Movie;