// defines a schema for the Place model, which represents a place document in the MongoDB database. 
// The schema specifies the structure and properties of a place, including its title, description, image URL, address, location coordinates, and the ID of the user who created it.

// imports the mongoose module, which is an Object-Document Mapping (ODM) library for MongoDB. 
// It allows us to interact with MongoDB in a more structured and convenient way.
const mongoose = require('mongoose');


// assigns the Schema class from the mongoose module to a variable called Schema. 
// The Schema class is used to define the structure and properties of MongoDB documents.
const Schema = mongoose.Schema;

// defines a placeSchema using the Schema class. It specifies the structure and properties of a document for a place in the application.
const placeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        lat: { type: Number, required: false },
        lng: { type: Number, required: false },
    },
    creator: { type: mongoose.Types.ObjectId, required: true , ref: 'User'}     //a reference to the User model. It stores the ID of the user who created the place. 
                                                                                // It is of type mongoose.Types.ObjectId and is a required field. The ref: 'User' part indicates that the creator field references the User model.
});
// relation    creator: { type: mongoose.Types.ObjectId, required: true , ref: 'User'} 


// creates a new model named 'Place' based on the placeSchema. This model will allow us to interact with the 'places' collection in the MongoDB database, perform CRUD operations, and define custom methods associated with places.
module.exports = mongoose.model('Place', placeSchema);
