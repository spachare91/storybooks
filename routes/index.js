const express = require('express')
const {ensureAuth, ensureGuest}= require('../middleware/auth')
const router = express.Router()
const Story = require('../models/Story')

router.get('/',ensureGuest,(req, res) => {
    res.render('login');
})

router.get('/dashboard',ensureAuth, async (req, res) => {

    try {
        const stories = await Story.find({user: req.user.id})
        const name = req.user.displayName;
        res.render('dashboard',{name,stories});

        
    } catch (error) {
        console.log(error);
        res.render("500")
        
    }

})

module.exports = router