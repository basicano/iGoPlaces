//  allows us to create custom error objects with additional properties.
class HttpError extends Error {
  // run whenever the Class is intatitated
  constructor(message, errorCode) {
    super(message); // Add a "message" property
    this.code = errorCode; // Adds a "code" property
  }
}

module.exports = HttpError;
