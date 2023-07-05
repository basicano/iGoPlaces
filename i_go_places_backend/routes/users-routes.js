const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');

// creates a new instance of the Express router. 
// The router is used to define routes for handling different HTTP methods (GET, POST, etc.) and associating them with specific controller functions.
const router = express.Router();

// defines a GET route for retrieving all users. The route path is '/', representing the root path. 
// The associated controller function is getUsers from the usersController module.
router.get('/', usersController.getUsers);

// defines a POST route for user signup. The route path is '/signup'. The associated controller function is signup from the usersController module.

router.post(
    '/signup',
    // fileUpload.single('image') is a middleware that handles file uploads and expects a single file with the field name 'image'.
    fileUpload.single('image'),
    // array [...] contains validation rules for the request body fields. For example, it checks that the 'name' field is not empty, the 'email' field is a valid email address (normalized to lowercase), and the 'password' field has a minimum length of 6 characters.
    [
      check('name')
        .not()
        .isEmpty(),
      check('email')
        .normalizeEmail() // Test@test.com => test@test.com
        .isEmail(),
      check('password').isLength({ min: 6 })
    ],
    usersController.signup
  );

// defines a POST route for user login. The route path is '/login'. The associated controller function is login from the usersController module.
router.post('/login', usersController.login);

// exports the defined router, making it accessible to other parts of the application.
module.exports = router;
