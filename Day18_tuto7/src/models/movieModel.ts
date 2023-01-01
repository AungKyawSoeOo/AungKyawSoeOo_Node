import { Schema, model } from 'mongoose';

const movieSchema = new Schema({
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
  },
  review: {
    type: String,
    required: true
  },
  deleted_at: {
    type: Date
  },
},
  {
    timestamps: true
  }
);
export default model("Movie", movieSchema)