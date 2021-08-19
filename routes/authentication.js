const { Router } = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {

    router.post('/register', (req, res) => {
        //req.body.email
        //req.body.username
        //req.body.password
        if (!req.body.email) {
            res.json({ success: false, message: 'You must provide an email'});
        } else {
            if (!req.body.username) {
                res.json({ success: false, message: 'You must provide a username'});
            } else {
                if (!req.body.password) {
                    res.json({ success: false, message: 'You must provide a password'});
                } else {
                    let user = new User({
                        email: req.body.email.toLowerCase(),
                        username: req.body.username.toLowerCase( ),
                        password: req.body.password
                     });
                     user.save((err) => {
                        if (err) {
                            if(err.code === 11000) {
                                res.json({ success: false, message: 'Username or Email Already Exists' });
                            }
                            else {
                                if (err.errors){
                                    if(err.errors.email){
                                        res.json({ success: false, message: err.errors.email.message });
                                    }
                                    else{
                                        if(err.errors.username){
                                            res.json({ success: false, message: err.errors.username.message });
                                        }
                                        else{
                                            if(err.errors.password){
                                                res.json({ success: false, message: err.errors.password.message });
                                            }
                                            else{
                                                res.json({ success: false, message: err });
                                            }
                                        }
                                    }
                                }
                                else {
                                    res.json({ success: false, message: 'Could not save user:', err});
                                }
                            }
                        } else {
                          res.json({ success:true, message: 'Account Registered!' });
                        }
                    });
                }
            }
        }
    });

    router.get('/checkEmail/:email', (req, res) => {
        if(!req.params.email){
            res.json({ success: false, message: 'Email was not provided' });
        } else {
            User.findOne({ email: req.params.email }, (err, user) => {
                if(err){
                    res.json({ success: false, message: err });
                } else {
                    if (user) {
                        res.json({ success: false, message: 'Email is already taken' });
                    } else {
                        res.json({ success: true, message: 'Email is Available' });
                    }
                }
            });
        }
    });
    
    router.get('/checkUsername/:username', (req, res) => {
        if(!req.params.username){
            res.json({ success: false, message: 'Username was not provided' });
        } else {
            User.findOne({ username: req.params.username }, (err, user) => {
                if(err){
                    res.json({ success: false, message: err });
                } else {
                    if (user) {
                        res.json({ success: false, message: 'Username is already taken' });
                    } else {
                        res.json({ succes: true, message: 'Username is Available' });
                    }
                }
            });
        }
    });

    router.post('/login', (req, res) => {
        if(!req.body.username){
            res.json({ success: false, message: "No username was found" });
        } else {
                if(!req.body.password){
                    res.json({ success: false, message: "No password was found" });
                } else {
                      User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
                      	if(err){
                      		res.json({ success: false, message: err });
                      	} else {
                      		if(!user) {
                      			res.json({ success: false, message: 'Username not found' });
                      		} else {
                      			const validPassword = user.comparePassword(req.body.password);
                      			if (!validPassword) {
                                    res.json({ success: false, message: 'Password Invalid' });
                      			} else {
                                    const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' });
                                    res.json({ success: true, message: 'Login Successful !', token: token, user: { username: user.username } });
                      			}
                      		}
                      	}
                      });
                }
        }
    });

    router.use((req, res, next) => {
        const token = req.headers['authorization']; // Create token found in headers
        // Check if token was found in headers
        if (!token) {
          res.json({ success: false, message: 'No token provided' }); // Return error
        } else {
          // Verify the token is valid
          jwt.verify(token, config.secret, (err, decoded) => {
            // Check if error is expired or invalid
            if (err) {
              res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
            } else {
              req.decoded = decoded; // Create global variable to use in any request beyond
              next(); // Exit middleware
            }
          });
        }
      });

    router.get('/profile', (req, res) => {
        User.findOne({ _id: req.decoded.userId }).select('username email').exec((err, user) => {
            if(err){
                res.json({ success: false, message: err });
            } else {
                if (!user) {
                    res.json({ success: false, message: 'User Not Found' });
                } else {
                    res.json({ success: true, user: user });
                }
            }
        });
    }); 

    return router;
}