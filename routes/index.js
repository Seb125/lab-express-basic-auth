const router = require("express").Router();
const User = require('../models/User.model');
const{isLoggedIn} = require("../middleware/route-guard");


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/userProfile', isLoggedIn, (req, res) => res.render('users/user-profile', { userInSession: req.session.currentUser }));

module.exports = router;
