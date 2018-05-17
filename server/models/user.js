const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");
var validate = require('mongoose-validator');

var nameValidator = [
	validate({
		validator: 'isLength',
		arguments: [3, 50],
		message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
	  }),
	  validate({
		validator: 'matches',
		arguments: /^[a-zA-Z\-]+$/i,
		message: 'Name should contain alphabets only'
	  })
];
	
var emailValidator = [
	validate({
		validator: 'isEmail',
		passIfEmpty: true,
		message: 'Enter a valid email'
	  })
];

var passwordValidator = [
	validate({
		validator: 'isLength',
		arguments: [6, 15],
		message: 'Password should be between 6 to 15 characters'
	  })
];

const userSchema = new Schema({
	fname: {type: String, required: [true, 'First Name is required'], validate: nameValidator},
	lname: {type: String, required: [true, 'Last Name is required'], validate: nameValidator},
	email: {type: String, unique: true, lowercase: true, required: [true, 'Email is required'], validate: emailValidator},
	pwd: {type: String, required: [true, 'Password is required'], validate: passwordValidator}	
});

userSchema.pre("save", function(next){
	let user = this;
	bcrypt.hash(user.pwd,null,null,function(err,hash){
		if(err) return next(err);
		user.pwd = hash;
		next();
	});
});

module.exports = mongoose.model('user', userSchema, 'UserInfo');