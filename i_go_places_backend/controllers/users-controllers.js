const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

// efine a function called getUsers that takes three parameters: req, res, and next. 
// These parameters represent the request, response, and the next middleware function in an Express.js application.
const getUsers = async (req, res, next) => {
  let users;
  try {
    // try to fetch users from the database using the User model
    users = await User.find({}, '-password');
  } catch (err) {
    // create a custom error object using HttpError and pass it to the next middleware function to handle the error.
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  // database operation is successful, we send a JSON response containing the retrieved users. 
  // The users.map(...) function maps each user object to a new object using the toObject() method with { getters: true } option, 
  // which helps in transforming the user object into a plain JavaScript object.
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  // validationResult function from express-validator to check if there are any validation errors in the request. 
  // If there are validation errors, we create a custom error object using HttpError and pass it to the next middleware function.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  // the name, email, and password values from the req.body object. These values represent the user's name, email, and password sent in the request.
  const { name, email, password } = req.body;

  let existingUser;
  try {
    // find an existing user with the provided email address in the database using the User model. 
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  // use the bcryptjs library to hash the user's password for security purposes. 
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not has pass, please try again.',
      500
    );
    return next(error);
  }

  // create a new User object using the User model and assign the name, email, hashed password, and an empty places array. 
  // The req.file.path represents the path to the user's image file.
  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: []
  });

  // save the newly created user to the database
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  // generate a JSON Web Token (JWT) using the jsonwebtoken library. The JWT includes the user's ID, email, and an expiration time of 1 hour. 
  // If an error occurs during the token generation process, we create a custom error object using HttpError and pass it to the next middleware function.
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  // If everything is successful, we send a JSON response with the user's ID, email, and the generated token. 
  // The response status is set to 201, indicating a successful creation.
  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};


// login function follows a similar structure to the signup function. 
// It handles the user login process by comparing the provided email and password with the existing user's credentials. 
// If the login is successful, it generates a new JWT and sends a response with the user's ID, email, and token.
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Loggin in failed, please try again later.',
      500
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
