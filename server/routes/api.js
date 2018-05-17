const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const user = require("../models/user");
const path = require("path");
var jwt = require('jsonwebtoken');
var secret = 'harrypotter';
const bcrypt = require("bcrypt-nodejs");

const db = "mongodb://localhost:27017/InnovifyTest";
mongoose.Promise = global.Promise;
mongoose.connect(db, function(err){
	if(err) {
		console.error("Error! " + err);
	}
});

//********* GET REQUESTS **********

router.get('/users', function(req,res){
	user.find().exec(function(err, usrs){
		if(err) {
			res.json({success: false, message: "Unable to fetch users"});
		} else {
			res.json(usrs);
		}
	})
});

router.get('/user/:userId', function(req,res){
	user.findById(req.params.userId).exec(function(err, pic){
		if(err) {
			res.json({success: false, message: "Unable to fetch user"});
		} else {
			res.json(pic);
		}
	})
});

//********* POST REQUESTS **********

router.post('/user', function(req,res){
	if(req.body) {
		var usr = new user();
		usr.fname = req.body.fname;
		usr.lname = req.body.lname;
		usr.email = req.body.email;
		usr.pwd = req.body.pwd;
		
		usr.save(function(err, usrl){
			if(err) {
				if(err.errors == undefined) {
					res.json({success: false, message:err.message});
				}else if(err.errors.fname) {
					res.json({success: false, message:err.errors.fname.message});
				}else if(err.errors.lname) {
					res.json({success: false, message:err.errors.lname.message});
				}else if(err.errors.email) {
					res.json({success: false, message:err.errors.email.message});
				}else if(err.errors.pwd) {
					res.json({success: false, message:err.errors.pwd.message});
				}
			} else {
				usrl.pwd = "";
				res.json({success: true, user: usrl});
			}
		})
	}
	else {
		res.json({success: false, message:"Request empty"});
	}
});

router.post('/login', function(req,res){
	user.findOne({email: req.body.email}).exec(function(err, usr){
		if(err) {
			res.json({success: false, message: "Login failed!"});
		} else if (usr) {
			bcrypt.compare(req.body.pwd, usr.pwd, (err, result) => {
                if(result) {
                    usr.pwd = "";
					var token = jwt.sign({data: usr}, secret, { expiresIn: '24h' });
					res.json({success: true, user: usr, token: token});
                } else {
                	res.json({success: false, message: 'Email and Password donot match'});
                }
           });
		}
	})
});

router.use(function(req,res,next){
	var token = req.body.token || req.body.query || req.headers["x-access-token"];
	if(token){
		jwt.verify(token, secret, function(err, decoded) {
			if(err) {
				res.json({success: false, message: "Token invalid"});
			} else {
				req.decoded = decoded;
				next();
			}
		})
	} else {
		res.json({success: false, message: "No token provided"});
	}
});

router.post('/me', function (req, res) {
	res.json({user: req.decoded, success: true});
});

module.exports = router;