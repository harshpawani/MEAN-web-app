/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { Schema } = mongoose;

// Validate Function to check title length
let titleLengthChecker = (title) => {
    if (!title) {
        return false;
    }
    else {
        if(title.length < 5 || title.length > 50) {
            return false;
        }
        else {
            return true;
        }
    }
};

// Validate Function to check if valid title format
let alphaNumericTitleChecker = (title) => {
    // Check if e-mail exists
    if (!title) {
      return false; // Return error
    } else {
      // Regular expression to test for a valid e-mail
      const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
      return regExp.test(title); // Return regular expression test results (true or false)
    }
  };
  
// Array of Email Validators
const titleValidators = [
  // First Email Validator
  {
    validator: titleLengthChecker,
    message: 'Title must be at least 5 characters but no more than 30'
  },
  // Second Email Validator
  {
    validator: alphaNumericTitleChecker,
    message: 'Title must be a alphaNumeric'
  }
];

let bodyLengthChecker = (body) => {
	if (!body) {
	   return false;
	}
	else {
	 if (body.length < 5 || body.length > 500){
        return false;
	 }
	 else {
        return true;
	 }
	}
} 


    // Array of body validators
const bodyValidators = [
    // First body validator
    {
        validator: bodyLengthChecker,
        message: 'Body must be at least 5 characters but no more than 500'
    }
];


let commentLengthChecker = (comment) => {
	if (!comment[0]) {
	   return false;
	}
	else {
	 if (comment[0].length < 1 || comment[0].length > 200){
        return false;
	 }
	 else {
        return true;
	 }
	}
} 


  // Array of comment validators
const commentValidators = [
    // First comment validator
    {
      validator: commentLengthChecker,
      message: 'Comment may not exceed 200 characters'
    }
];
  

const blogSchema = new Schema({
	title: { type: String, required: true, validate: titleValidators},
	body: { type: String, required: true, validate: bodyValidators },
	createdBy: { type: String },
	createdAt: { type: Date, default: Date.now() },
	likes: { type: Number, default: 0 },
	likedBy: { type: Array,},
	dislikes: { type: Number, default: 0 },
	dislikedBy: { type: Array },
	comments: [
		{
			comment: { type: String, validate: commentValidators },
			commentator: { type: String }
		}
	]

});

module.exports = mongoose.model('Blog', blogSchema);