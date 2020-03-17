const express = require('express');

const db = require('./postDb')

const router = express.Router();

//GET ALL POSTS
router.get('/', (req, res) => {
  db.get()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "There has been an error fetching the posts" })
    })
});

//GET POST BY ID
router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post)
});

//DELETE POST BY ID
router.delete('/:id', validatePostId, (req, res) => {
  db.remove(req.params.id)
    .then(() => {
      res.status(200).json({ message: "post has been deleted" })
    })
    .catch(() => {
      res.status(500).json({ message: "There has been an error trying to delete the post." })
    })
});

//UPDATE POST
router.put('/:id', validatePostId, (req, res) => {
  db.update(req.params.id, req.body)
    .then(() => {
      res.status(200).json({ message: "Post has been updated"})
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "There has been an error updating the post" })
    })
});

// custom middleware

function validatePostId(req, res, next) {
  db.getById(req.params.id)
    .then(post => {
      if(post !== undefined) {
        req.post = post
        next();
      } else {
        res.status(400).json({ errorMessage: "Could not find a post with that id." })
      }
    })
}

module.exports = router;
