import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import multer  from "multer";
import bodyParser from "body-parser"
import pug from "pug"
import cors from "cors"
import * as swaggerUI from 'swagger-ui-express';
import * as YAML from 'js-yaml';
import movie_route from "./routes/movieRoute.js"
import form_route from "./routes/formRouter.js"
import methodOverride from "method-override"
import fs from 'fs';
import session from "express-session"
import cookieParser from "cookie-parser"
mongoose.set('strictQuery', true);
dotenv.config();
const app = express();
app.set("view engine", "pug");
app.set("views","./src/public/views")

const PORT = process.env.PORT || 3000;
const yamlString = fs.readFileSync('./swagger/api.yaml', 'utf8');
const swaggerDocument = YAML.load(yamlString) as swaggerUI.JsonObject;
app.use(methodOverride('_method'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multer().any())
app.use(express.static("./src/public")); 

app.use(cookieParser());


mongoose.connect(process.env.DATABASE || "")
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server listening on port 3000");

    })

    app.use("/", form_route);
    app.use("/api/movies/", movie_route);
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
   
  })
