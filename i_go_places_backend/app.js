const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors");

// importing custom modules
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

// create an instance of the Express application and define the CORS options. 
const app = express();
const corsOptions ={
   origin:'*',                   // allowing requests from any domain
   credentials:true,             // access-control-allow-credentials:true => enabling the sending of cookies and other credentials in CORS requests.
   optionSuccessStatus:200,      // indicating that a successful response can have a status code of 200.
}

// CORS middleware to the Express application, enabling CORS for all routes.
app.use(cors(corsOptions));

// sets up the bodyParser middleware to parse incoming requests with JSON payloads. It allows us to access the request body in JSON format.
app.use(bodyParser.json());

// serves static files from the uploads/images directory, making them accessible through the URL path /uploads/images. 
// It uses the express.static middleware to handle static file serving.
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

// sets up additional CORS headers manually. It allows requests from any domain (Access-Control-Allow-Origin: '*'), 
// specifies the allowed request headers, and allows specific HTTP methods (GET, POST, PATCH, DELETE).
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

// define the routes for handling requests related to places and users. 
// They associate the imported route handlers (placesRoutes and usersRoutes) with specific URL paths (/api/places and /api/users, respectively).
app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

// middleware handles requests for routes that are not defined. 
// It creates a new instance of the HttpError modelfrom the custom module http-error with a message indicating 
// that the route was not found (Could not find this route.) and a status code of 404 (which represents "Not Found"). 
// Then it throws the error, which will be caught by the error handling middleware.
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

// error handling middleware. It receives any errors thrown by the previous middleware or route handlers. 
// If there was a file attached to the request (req.file), it tries to delete it using the fs.unlink function. 
// If the response headers have already been sent, it passes the error to the next error handling middleware. 
// Otherwise, it sets the response status code based on the error's code property, or 500 (Internal Server Error) if no code is provided. 
// It sends a JSON response containing the error message or a generic message if the error message is not available.
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

// establishes a connection to a MongoDB database using the mongoose module. It uses the mongoose.connect method and passes the MongoDB connection string. 
// If the connection is successful, it starts the Express application to listen for incoming requests on port 5000. 
// If there is an error during the connection, it logs the error to the console.
mongoose
.connect(`mongodb+srv://ritika:NdTKhlGTILQrTkSR@cluster0.ihjeh1s.mongodb.net/i_go_places?retryWrites=true&w=majority`)
.then( ()=>{
  app.listen(5000);
})
.catch(err=>{
  console.log(err);
});
