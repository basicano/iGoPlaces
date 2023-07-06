// express-validator for input validation, mongoose for interacting with the MongoDB database
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

//  handles retrieving a specific place based on its ID
const HttpError = require('../models/http-error');
// const getCoordsForAddress = require('../util/location');

const Place = require('../models/place');
const User = require('../models/user');

const getPlaceById = async (req, res, next) => {
  // extracts the place ID from the request parameters
  const placeId = req.params.pid; // { pid: 'p1' }

  let place;
  try {
    // tries to find the place in the database using Place.findById
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place.',
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      // not found, it creates a custom error object
      'Could not find a place for the provided id.',
      404
    );
    return next(error);
  }

  // when sucessful, returns the place as a JSON response.
  res.json({ place: place.toObject({ getters: true }) }); // => { place } => { place: place }
};

// function getPlaceById() { ... }
// const getPlaceById = function() { ... }

// getPlacesByUserId function retrieves all places associated with a specific user ID
const getPlacesByUserId = async (req, res, next) => {
  // extracts the user ID from the request parameters
  const userId = req.params.uid;

  console.log(userId);
  let places;
  try {
    // find the places in the database using Place.find
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed, please try again later',
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find places for the provided user id.', 404)
    );
  }

  // returns the places as a JSON response
  res.json({ places: places.map(place => place.toObject({ getters: true })) });
};

//  handles the creation of a new place.
const createPlace = async (req, res, next) => {
  // checks for validation errors using validationResult
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  // extracts the necessary data from the request body. It . 
  const { title, description, address, creator } = req.body;

  coordinates = [123,123];
  // let coordinates;
  // try {
  //   coordinates = await getCoordsForAddress(address);
  // } catch (error) {
  //   return next(error);
  // }

  // const title = req.body.title;
  // creates a new Place object with the provided data
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    console.log(err);
    const error = new HttpError('Creating place failed, please try again', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }

  console.log(user);

  // also associates the place with the corresponding user by adding the place to the user.places array
  try {
    // session in MongoDB allows us to perform multiple database operations within a single transaction-like context, ensuring atomicity and data consistency. 
    // We then start a transaction by calling the startTransaction() method on the session object.
    const sess = await mongoose.startSession();
    sess.startTransaction();

    //  save the newly created place object (createdPlace) to the database
    // we pass the session option with the sess object to ensure that the save operation is performed within the current session.
    await createdPlace.save({ session: sess });

    // update the user object by pushing the createdPlace object into the places array. 
    // This associates the newly created place with the user. 
    // We then save the updated user object to the database, again passing the session option with the sess object.
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();    // commits all the changes made within the session to the database atomically
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

// handles updating an existing place
const updatePlace = async (req, res, next) => {
  // checks for validation errors using validationResult
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this place.', 401);
    return next(error);
  }

  // if user is the owner, update 
  place.title = title;
  place.description = description;

  // save the changes
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  // returns the updated place in the response
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

// handles the deletion of a place
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not find place for this id.', 404);
    return next(error);
  }

  // checks if the logged-in user is the creator of the place
  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to delete this place.',
      401
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    // await place.remove({ session: sess }, function(err,removed) {
    //   console.log(err);
    // });
    // console.log(place);
    // place.creator.places.pull(place);
    // await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

