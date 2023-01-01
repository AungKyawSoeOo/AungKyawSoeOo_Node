import express from 'express';
import { body } from 'express-validator';
import { compose ,contact,home} from '../controllers/movieController.js';

const formRouter = express.Router();

formRouter.route("/")
.get(home)
formRouter.route("/compose")
  .get(compose)

formRouter.route("/contact")
  .get(contact)

export default formRouter