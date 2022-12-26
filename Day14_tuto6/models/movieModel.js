import { Schema, model } from "mongoose"
const MovieSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
export default model("Movie", MovieSchema);
