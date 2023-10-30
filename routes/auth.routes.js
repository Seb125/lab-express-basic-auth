// routes/auth.routes.js
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');

const{isLoggedOut} = require("../middleware/route-guard");


const mongoose = require('mongoose');

// GET route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));

router.get('/login', isLoggedOut, (req, res) => res.render('auth/login'));


  router.post('/signup', async (req, res, next) => {

    // check if user already exists


    let response = await User.findOne({username: req.body.username})
      try{
        if(!response) {
          if (!req.body.username || !req.body.email || !req.body.password) {
            res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
            return;
          }

          // make sure passwords are strong:
        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!regex.test(req.body.password)) {
          res
            .status(500)
            .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
          return;
        }

          // If theres is nor user with that username
            const salt = bcryptjs.genSaltSync(12)
            const hashedPassword = bcryptjs.hashSync(req.body.password, salt)

            const newUser =  await User.create({...req.body, passwordHash: hashedPassword})
            
            res.redirect('/auth/login')
        } else {
          // send an error back to the page
          res.status(500).render('auth/signup', {errorMessage: 'Username already taken'})
        }
      } catch(err){
        if (err instanceof mongoose.Error.ValidationError) {
          
          res.status(500).render('auth/signup', { errorMessage: err.message });
        } else {
        
        console.log(err)
        } 
      }

      });
     
     
router.post('/login' , async (req, res, next) => {
try{
  const foundUser = await User.findOne({email: req.body.email})
  
  if (req.body.email === '' || req.body.password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
}
  if (!foundUser) {
    res.render('login', {errorMessage: 'Please try again'})
  } else { 
    const passwordMatch = bcryptjs.compareSync(req.body.password, foundUser.passwordHash);

    if (passwordMatch) {
      req.session.currentUser = foundUser;
      const populated = await req.session.currentUser.populate('movies')
      console.log(populated)
      res.render('users/user-profile', { userInSession: populated })
    } else {
      res.render('auth/login', {errorMessage: 'Incorrect details'})
    }
  }
} catch (err) {
  console.log(err);
}
})
  
router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});


module.exports = router;
