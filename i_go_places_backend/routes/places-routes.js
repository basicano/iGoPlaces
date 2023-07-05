const express = require('express');
const { check } = require('express-validator');

const placesControllers = require('../controllers/places-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

// a new instance of the Express router. The router is used to define routes for handling different HTTP methods (GET, POST, etc.) 
// and associating them with specific controller functions.
const router = express.Router();


// defines a GET route for retrieving a place by its ID. The route path is /:pid, where :pid is a dynamic parameter representing the place ID. 
// The associated controller function is getPlaceById from the placesControllers module.
router.get('/:pid', placesControllers.getPlaceById);

// defines a GET route for retrieving places by a specific user's ID. The route path is /user/:uid, where :uid is a dynamic parameter representing the user ID. 
// The associated controller function is getPlacesByUserId from the placesControllers module.
router.get('/user/:uid', placesControllers.getPlacesByUserId);

// applies the checkAuth middleware to all routes defined after it. The middleware ensures that the user is authenticated before accessing the routes.
router.use(checkAuth);

// defines a POST route for creating a new place. The route path is '/', representing the root path. 
// The associated controller function is createPlace from the placesControllers module.
router.post(
  '/',
  // fileUpload.single('image') is a middleware that handles file uploads and expects a single file with the field name 'image'.
  // array [...] contains validation rules for the request body fields. 
  // For example, it checks that the 'title' field is not empty, the 'description' field has a minimum length of 5, and the 'address' field is not empty.
  fileUpload.single('image'),
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address')
      .not()
      .isEmpty()
  ],
  placesControllers.createPlace
);

// defines a PATCH route for updating an existing place. The route path is /:pid, where :pid is a dynamic parameter representing the place ID. 
// The associated controller function is updatePlace from the placesControllers module.
router.patch(
  '/:pid',
  //  array [...] contains validation rules for the request body fields. It checks that the 'title' field is not empty and the 'description' field has a minimum length of 5.
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  placesControllers.updatePlace
);

// defines a DELETE route for deleting a place by its ID. The route path is /:pid, where :pid is a dynamic parameter representing the place ID. 
// The associated controller function is deletePlace from the placesControllers module.
router.delete('/:pid', placesControllers.deletePlace);

// exports the defined router, making it accessible to other parts of the application.
module.exports = router;
