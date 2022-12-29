import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import multer  from "multer";
import bodyParser from "body-parser"
import cors from "cors"
import * as swaggerUI from 'swagger-ui-express';
import * as YAML from 'js-yaml';
import post_route from "./routes/postRoute.js"
import fs from 'fs';
mongoose.set('strictQuery', true);
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const yamlString = fs.readFileSync('./swagger/api.yaml', 'utf8');
const swaggerDocument = YAML.load(yamlString) as swaggerUI.JsonObject;;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multer().any())


mongoose.connect(process.env.DATABASE || "")
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server listening on port 3000");

    })
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
    app.use("/api/posts/", post_route);
  })
