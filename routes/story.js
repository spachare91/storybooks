const { application } = require('express')
const express = require('express')
const {ensureAuth}= require('../middleware/auth')
const router = express.Router()
const Story = require('../models/Story')
// all request will go live /story/

// /add will render add page
router.get('/add',ensureAuth,(req, res) => {
    res.render('add');
})

router.post('/',ensureAuth,async (req, res) => {

    try {
        req.body.user=req.user.id;
        await Story.create(req.body);
        res.redirect("/dashboard");

        
    } catch (error) {
        console.log(error)
        res.render('500')
        
    }
})

//get all public stories

router.get('/', ensureAuth, async (req, res) => {
    try {
      const stories = await Story.find({ status: 'public' })
        .populate('user')
        .sort({ createdAt: 'desc' })
        .lean()
  
      res.render('index', {
        stories,
      })
    } catch (err) {
      console.error(err)
      res.render('500')
    }
})

// get edit/story/:id
// display context of story which we need to change
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
       let idd =req.params.id;
       const story = await Story.findOne({ _id: idd }).lean()
  
      res.render('editstory', {
        story
      })
    } catch (err) {
      console.error(err)
      res.render('500')
    }
})

router.post('/:id', ensureAuth, async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).lean()
  
      if (!story) {
        return res.render('error/404')
      }
  
      if (story.user != req.user.id) {
        res.redirect('/stories')
      } else {
        story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          runValidators: true,
        })
  
        res.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
})

// delete story
router.post('/delete/:id', ensureAuth, async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).lean()
  
      if (!story) {
        return res.render('error/404')
      }
  
      if (story.user != req.user.id) {
        res.redirect('/stories')
      } else {
        await Story.remove({ _id: req.params.id })
        res.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  })

// view story from read more and when clicked on link

router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate('user').lean()

    if (!story) {
      return res.render('404')
    }

    if (story.user._id != req.user.id && story.status == 'private') {
      res.render('404')
    } else {
      var data=story.body.replace(/<p>(.*)<\/p>/g, "$1\n");

      res.render('show', {
        story:story,data:data
      })
    }
  } catch (err) {
    console.error(err)
    res.render('404')
  }
})

// more from single user

router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean()

    res.render('index', {
      stories,
    })
  } catch (err) {
    console.error(err)
    res.render('500')
  }
})


module.exports = router