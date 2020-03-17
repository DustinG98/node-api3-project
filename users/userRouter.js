const express = require('express');

const db = require('./userDb')
const postDb = require('../posts/postDb')

const router = express.Router();



//ADD USER
router.post('/', validateUser ,(req, res) => {
  db.insert(req.body)
    .then((resp) => {
      res.status(201).json({ message: "User created.", user: resp})
    })  
    .catch(err => {
      res.status(500).json({ errorMessage: "Cannot create user."})
    })
});

//ADD POST TO USER
router.post('/:id/posts', validateUserId, validatePost ,(req, res) => {
  postDb.insert({ user_id: req.params.id, ...req.body })
    .then(post => {
      res.status(201).json(post)
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "there has been an error trying to add the post.", error: err})
    })
});

//GET ALL USERS
router.get('/', (req, res) => {
  db.get()
    .then(users => {
      res.status(201).json(users)
    })
    .catch(err => {
      res.status(500).json(err)
    })
});

//GET USER BY ID
router.get('/:id', validateUserId ,(req, res) => {
  res.status(200).json(req.user)
});

//GET USERS POSTS
router.get('/:id/posts', validateUserId ,(req, res) => {
  db.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "There has been an error fetching the users posts" })
    })
});

//DELETE USER
router.delete('/:id', validateUserId ,(req, res) => {
  db.remove(req.params.id)
    .then(() => {
      res.status(200).json({ message: "User deleted" })
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "There was an error while attempting to delete the user." })
    })
});

//UPDATE USER
router.put('/:id', validateUserId, validateUser ,(req, res) => {
  db.update(req.params.id, req.body)
    .then(count => {
      if(count === 1) {
        res.status(200).json({ message: "User updated." })
      } else {
        res.status(500).json({ errorMessage: "there was an error updating the user." })
      }
    })
});

//custom middleware

function validateUserId(req, res, next) {
  db.getById(req.params.id)
    .then(user => {
      if(user !== undefined) {
        req.user = user;
        next()
      } else {
        res.status(400).json({ errorMessage: "A user with this ID does not exist." })
      }
    })
}

function validateUser(req, res, next) {
  if(!req.body) {
    res.status(400).json({ message: "missing user data" })
  } else if(!req.body.name) {
    res.status(400).json({ message: "missing required name field." })
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if(!req.body) {
    res.status(400).json({ message: "missing post data." })
  } else if(!req.body.text) {
    res.status(400).json({ message: "missing required text field" })
  } else {
    next();
  }
}

module.exports = router;
