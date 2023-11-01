const router = require("express").Router();
const User = require('../models/User.model');
const{isLoggedIn} = require("../middleware/route-guard");

const axios = require("axios");


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/userProfile', isLoggedIn, async (req, res) => {

  try{
   
    const updatedUser = await User.findOne({ email: req.session.currentUser.email }).populate('movies');
    req.session.currentUser = updatedUser; // should delete password for the session

    let userCharacters = [];

    for (const char of req.session.currentUser.characters) {
      const response = await axios.get(`https://rickandmortyapi.com/api/character/${char}`);
      userCharacters.push(response.data);
    }

    res.render('users/user-profile', { userInSession: req.session.currentUser, characters: userCharacters });


  } catch (err){
    console.log(err)
  }
})

router.get('/rickAndMorty', isLoggedIn, async (req, res) => {
  const characters = await axios.get("https://rickandmortyapi.com/api/character");

  //console.log(characters.data.results)

  res.render('api/rick-morty', {characters: characters.data.results})
})


router.post('/rickAndMorty', isLoggedIn, async (req, res) => {
  try {
  const characterID = req.body;
  
  let currentUser = req.session.currentUser
  const foundUser = await User.findOneAndUpdate({email: currentUser.email}, { $addToSet: { characters: characterID.characterId } }, { new: true })
  
  res.redirect("rickAndMorty")
  } catch (error) {
    console.log(error)
  }
})


module.exports = router;
