const router = require("express").Router();
const User = require('../models/User.model');
const{isLoggedIn} = require("../middleware/route-guard");


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/userProfile', isLoggedIn, async (req, res) => {

  try{
    const updatedUser = await User.findOne({ email: req.session.currentUser.email }).populate('movies');
    console.log(updatedUser)
    res.render('users/user-profile', { userInSession: updatedUser });


  } catch (err){
    console.log(err)
  }
})




module.exports = router;
