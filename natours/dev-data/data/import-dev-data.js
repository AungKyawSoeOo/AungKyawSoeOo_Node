import fs from "fs";
import mongoose from 'mongoose';
import Tour from "../../models/tourModel.js";
import User from "../../models/userModel.js";
import Review from "../../models/reviewModel.js";
import {logger} from "../../logger/Logger.js"
import dotenv from 'dotenv';
mongoose.set('strictQuery', true);
dotenv.config();
const port = 8000 || process.env.PORT;

mongoose
  .connect(process.env.MONGO_DB || '')
  .then(() => logger.info('MongoDB Connected!'))
  .catch((error) => logger.error(`Couldn't connect to MongoDB!`, error));

// Read Json File
const tours=JSON.parse(fs.readFileSync('./dev-data/data/tours.json','utf-8'));
const users=JSON.parse(fs.readFileSync('./dev-data/data/users.json','utf-8'));
const reviews=JSON.parse(fs.readFileSync('./dev-data/data/reviews.json','utf-8'));
// Import data into DB
// node dev-data/data/import-dev-data.js --import
const importData=async()=>{
    try{
        await Tour.create(tours);
        await User.create(users,{validateBeforeSave:false});
        await Review.create(reviews);
        console.log('Data loaded');
    }catch(err){
        console.log(err);
    }
    process.exit();
}
// Delete all data from collection
// node dev-data/data/import-dev-data.js --delete
const deleteData=async()=>{
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data delete');
    }catch(err){
        console.log(err);
    }
    process.exit();
}

if(process.argv[2]==='--import'){
    importData();
}else if(process.argv[2]==='--delete'){
    deleteData();
}
console.log(process.argv);