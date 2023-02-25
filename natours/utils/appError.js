class AppError extends Error{
    // `Can't find ${req.originalUrl} on server`,404 (message,statusCode)
    constructor(message,statusCode){
        super(message);
        this.message=message;
        this.statusCode=statusCode;
        this.status=`${statusCode}`.startsWith('4') ? 'fail':'error';
        this.isOperational=true;
        Error.captureStackTrace(this,this.constructor);
    }
}
export default AppError;
  /*
The super(message) in the constructor of the AppError class is calling the constructor of
its parent class, Error. The message argument passed to super sets the error message of 
the error object created from the AppError class, which can be accessed through its message
property. The Error class is a built-in class in JavaScript that represents an error and
is the parent class of all error objects.
 */

/* Error.captureStackTrace(this,this.constructor); creates a stack trace 
 for the custom AppError object, starting at the AppError constructor function
 This allows the stack trace to show the origin of the error and help with debugging.
*/

