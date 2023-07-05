// defines a schema for the User model, which represents a user document in the MongoDB database. 
// The schema specifies the structure and properties of a user, including their name, email address, password, profile image, and the places associated with the user. 
// It also applies the uniqueValidator plugin to handle validation for unique fields.

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


// assigns the Schema class from the mongoose module to a variable called Schema. We will use this class to define the structure and properties of MongoDB documents.
const Schema = mongoose.Schema;

// defines a userSchema using the Schema class. It specifies the structure and properties of a user document in the application.
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: false },
    places: [{ type: mongoose.Types.ObjectId, required: true , ref: 'Place'}] ,
    // places is an array of mongoose.Types.ObjectId values. It represents the places associated with the user. 
    // Each element in the array is a reference to a Place document in the MongoDB database.
});

// applies the uniqueValidator plugin to the userSchema. 
// The plugin adds validation for unique fields and provides helpful error messages when a duplicate value is encountered for the unique fields in the schema.
userSchema.plugin(uniqueValidator);

// exports the compiled model based on the userSchema using the mongoose.model function. It creates a new model named 'User' based on the userSchema. 
// This model will allow us to interact with the 'users' collection in the MongoDB database, perform CRUD operations, and define custom methods associated with users.
module.exports = mongoose.model('User', userSchema);
