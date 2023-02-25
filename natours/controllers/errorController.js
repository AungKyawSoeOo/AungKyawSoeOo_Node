import AppError from '../utils/appError.js';

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleFailError=(err)=>{
  const message=err.msg;
  return new AppError(message,401);

}
const handleDuplicateFieldDB = (err) => {
  // key value comes from err
  const value = err.keyValue;
  const name = value['name'];
  const message = `Duplicate field value: "${name}" Please use another value`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  console.log(errors+ "eeee");
  const ms = `Invalid input data. ${errors.join('. ')}`;
  console.log(ms);
  return new AppError(ms, 400);
};
const handleJWTError = () => new AppError('Invalid token', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Log in again', 401);

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } 
    // Render website
    return res.status(err.statusCode).render('error', {
      title: 'something went wrong',
      msg: err.message,
    });
  
};

const sendErrorProd = (err, req, res) => {

  if (req.originalUrl.startsWith('/api')) {
    // API
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      // Programming or other unknown error: don't leak error details
    } 
      // 1) Log error
      console.error('ERROR', err);
      // 2) Send generic message
      return  res.status(err.statusCode).json({
        title: 'Something went wrong',
        message: err.message,
      });
    
  } 

    if (err.isOperational) {
      s.status(err.statusCode).render('error',{
        title: 'Something went wrong',
        message: err.message,
      });
      // Programming or other unknown error: don't leak error details
    } else {
   
      // 1) Log error
      console.error('ERROR', err);
      // 2) Send generic message
      res.status(err.statusCode).render('error',{
        title: 'Something went wrong',
        msg: 'Please try again later',
      });
    }
  }

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // making shallow copy .. not affect to original one
    let error = {...err};
    error.msg=err.message;
    //cast error object id
    if (error.kind === 'ObjectId') {
      error = handleCastErrorDB(error);
    }
    //duplicate id
    if (error.code === 11000) {
      error = handleDuplicateFieldDB(error);
    }

    // for (const key in error.errors) {
    //   console.log(error.errors[key].name, error.errors[key].message);

    // }
    if (error.status === 'error') {
      error = handleValidationErrorDB(error);
    }
    if(error.status==='fail'){
      error=handleFailError(error);
    }
    // token that doesn't exist
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }
    sendErrorProd(error, req, res);
  }
};
