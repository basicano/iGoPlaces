// defines a multer middleware instance called fileUpload with specific configuration options. It sets limits for file size, configures storage options for saving files on disk, and filters files based on their MIME types. This middleware can be used in an Express application to handle file uploads.

const multer = require('multer');   // a middleware for handling file uploads in Node.js applications. It provides convenient methods for managing file uploads,
                                        // including storing files on disk or in cloud storage, defining file size limits, and filtering file types.

// defines a JavaScript object called MIME_TYPE_MAP. It maps the MIME types of image files to their corresponding file extensions. 
// This mapping is used later in the code to determine the file extension of an uploaded image based on its MIME type.
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

// initializes a multer middleware instance called fileUpload. It takes an object as a parameter, which specifies the configuration options for multer.
const fileUpload = multer({
  limits: 500000,          //  sets the maximum file size limit to 500,000 bytes (or approximately 500 KB). If a file exceeds this limit, an error will be thrown.
 
  //configures the storage options for handling uploaded files using multer.diskStorage. It specifies where the uploaded files should be stored on the disk and how their filenames should be generated.
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
      // The filename function is responsible for generating the filenames of the uploaded files. In this code, it uses the original filename provided by the client. However, it's worth noting that using the original filename can lead to filename conflicts if multiple users upload files with the same name. It doesn't use the ext variable, so the file extension will be preserved.
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, file.originalname);
    }
  }),
  // determines whether an uploaded file should be accepted or rejected based on its MIME type.
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  }
});

// exports the fileUpload middleware instance, allowing it to be imported and used in other parts of the codebase. Other files can now import this module and use fileUpload as middleware to handle file uploads.
module.exports = fileUpload;
