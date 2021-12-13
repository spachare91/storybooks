const express = require('express')
const passport = require('passport')

const router = express.Router()
//get request for auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

//calback route /auth/google/callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
});

router.get('/logout',(req,res) => {
    req.logout();
    res.redirect("/")
})


module.exports = router