import express from 'express';
import morgan from 'morgan';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import viewRouter from "./routes/viewRoutes.js";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import AppError from './utils/appError.js';
import globalErrorHandler from "./controllers/errorController.js";
import cookieParser from 'cookie-parser';
import rateLimit from "express-rate-limit";
import helmet from 'helmet';
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import path from 'path';
import cors from "cors";
import hpp from 'hpp'; //http parameter pollution
dotenv.config();
const app = express();
app.set('view engine','pug');
const viewsPath = new URL('./views/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1').replace(/^\//, ''); // /E: . remove /
const publicPath= new URL('./public/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1').replace(/^\//, '');
app.use(cors({
  origin: 'http://127.0.0.1:8000',
  credentials: true
}));
app.set('views', viewsPath);
// Serving static files
app.use(express.static(publicPath));


//global middlewares
// set security http headers
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
    objectSrc: ["'none'"],
    connectSrc: ["'self'", "http://127.0.0.1:8000"],
    upgradeInsecureRequests: []
  }
}));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limit requests from same API
const limiter=rateLimit({
  //100 request from same ip in one hour
  max:100,
  windowMs: 60*60*1000, // min * sec * ms
  message:'Too many requests from this IP, please try again in an hour! '
});
// only routes start with api
app.use('/api',limiter);

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
// app.use(express.json({limit:'10kb'}));
// Cookie parser
app.use(cookieParser());

// Data sanitization against NOSQL query injection
// {"email":{"$gt":""},"password:1234"} will login user without knowing email
// use package - express-mongo-sanitize
app.use(mongoSanitize());

// Data sanitization against XSS coross site attack
// use package - xss-clean
// change html input into entities eg. <div id>one</div> -> &lt div..
app.use(xss());

// Prevent paremeter pollution
// ../?sort=name&sort=duration -> error , by using hpp only get sort=duration
// but when access /?duration=5&duration=9 only return duration 9
// to get both of those we need to put that in whiteList
app.use(hpp({
  whitelist:[
    'duration',
    'ratingsQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price'
  ]
}));

//  custom middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

//routes
app.use('/',viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews',reviewRouter);
  // .all means all kinds of methods (get,post,put,patch,delete,...)
app.all('*',(req,res,next)=>{
  // const err=new Error(`Can't find ${req.originalUrl} on server`);
  // err.status="fail",
  // err.statusCode=404;
  // .originalUrl return any url that user input
   next(new AppError(`Can't find ${req.originalUrl} on server`,404));
});

app.use(globalErrorHandler);
export default app;
