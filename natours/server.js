import mongoose from 'mongoose';
import { logger } from './logger/Logger.js';
import dotenv from 'dotenv';
mongoose.set('strictQuery', true);

// uncaught exception
// need to caught before app
process.on('uncaughtException',err=>{
  console.log('UNCAUGHT EXCEPTION Shutting down...');
  console.log(err.name,err.message);
    // need to crash app in this , unhandle is optional
    process.exit(1);
});
// console.log(x);

import app from './app.js';
dotenv.config();
const port = 8000 || process.env.PORT;

mongoose
  .connect(process.env.MONGO_DB || '')
  .then(() => logger.info('MongoDB Connected!'))
  

const server=app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// unhandle rejection handling
// work on unhandle like db not connected ...
process.on('unhandledRejection',err=>{
  console.log(err.name,err.message);
  console.log('UNHANDLER REJECTION Shutting down...');
  // give server to process pending requests
  server.close(()=>{
     // 0 ->success   , 1 ->uncaught exception
  process.exit(1);
  });
});

