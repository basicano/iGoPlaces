// this middleware function is responsible for authenticating the incoming request by verifying the JWT included in the Authorization header. 
// It extracts the token, verifies it, and adds the user ID to the req.userData object, allowing subsequent middleware or route handlers to access the authenticated user's information.


// imports the jsonwebtoken module, which is a library used for generating and verifying JSON Web Tokens (JWTs). 
// JWTs are used for authentication and authorization in web applications.
const jwt = require('jsonwebtoken');

// imports the HttpError model from the ../models/http-error file. The HttpError model is a custom error class that we discussed earlier. 
// It is used to create instances of custom error objects with additional properties like error codes.
const HttpError = require('../models/http-error');

// exports a middleware function using the module.exports statement. 
// A middleware function is a function that has access to the request (req) and response (res) objects, and the next function. 
// It can perform operations on the incoming request, modify it, or terminate the request-response cycle.
module.exports = (req, res, next) => { 

  // checks if the HTTP method of the request is 'OPTIONS'. The 'OPTIONS' method is often used in CORS 
  // (Cross-Origin Resource Sharing) to check the available methods for a particular resource. 
  // If the method is 'OPTIONS', it means the request is a preflight request, and we simply call the next function 
  // to allow the request to proceed to the next middleware or route handler.
  if (req.method === 'OPTIONS') {
    return next();
  }

  // handles the authentication process using JWT.
  try {
    //  extract the JWT from the request headers by splitting the Authorization header value, which should be in the format 'Bearer TOKEN'. 
    // It takes the second part of the split (the token) and assigns it to the token variable.
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error('Authentication failed!');
    }

    // verifies the token using the jwt.verify method, which takes the token and a secret key (process.env.JWT_KEY) for verification. 
    // If the verification is successful, it returns the decoded token.
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId }; // decoded token contains the user ID (in the userId property) assign to req.userData for future use.
    next(); // calls the next function to allow the request to proceed to the next middleware or route handler.
  } catch (err) {
    // If any error occurs during the process (e.g., token is missing, invalid token, or verification fails), it catches the error, creates a new HttpError object with a message and error code, and passes it to the next function. 
    // This will trigger the error handling middleware, which can handle the error appropriately.
    const error = new HttpError('Authentication failed!', 401);
    return next(error);
  }
};
