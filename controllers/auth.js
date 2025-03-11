const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');


router.get("/sign-up", (req, res) =>{
    res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async(req, res) => {
    //no duplicate usernames
    const userinDatabase = await User.findOne({username: req.body.username});
    if(userinDatabase){
        return res.send("Username already taken");
    }
    //check if the password and confirm password are a match
    if(req.body.password !== req.body.confirmPassword){
        return res.send("Passwords do not match");
    }

   // create encrypted version of plain-text password(hashed and salted)
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    const user = await User.create(req.body);
    res.send(`thanks for signing up${user.username}`);

})
//get/sign-in route that will display the login form
router.get('/sign-in', (req, res)=>{
    res.render('auth/sign-in.ejs');
})
//Post/sign-in route that will be used when login form is submitted
router.post('/sign-in', async(req, res)=>{
    //find the user by username
   const userInDatabase = await User.findOne({
    username: req.body.username

   });
   //if the user is not found, send a message
   if(!userInDatabase){
    return res.send("Login failed. Please try again");
   }
   const validPassword = bcrypt.compareSync(
    req.body.password, 
    userInDatabase.password
);
if(!validPassword){
    return res.send("Login failed. Please try again");
}

//at this point we've made it past verification
req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id,
  
};
console.log(req.session);
res.redirect("/");
});
router.get('/sign-out', (req, res)=>{
    req.session.destroy();
    res.redirect('/');
}
);
module.exports = router;
