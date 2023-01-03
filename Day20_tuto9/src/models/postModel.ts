import { Schema, model } from 'mongoose';

const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
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
export default model("Post", postSchema)