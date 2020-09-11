const express = require("express");

const router = express.Router();

const Posts = require("./postDb.js");

router.get("/", (req, res) => {
  Posts.get()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(500).json({
        error: "Posts could not be retrieved.",
      });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  Posts.getById(req.params.id)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(500).json({
        error: "Posts by id could not be retrieved.",
      });
    });
});

router.delete("/:id", validatePostId, (req, res) => {
  Posts.remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({message: "The post has been nuked"});
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The post could not be removed",
      });
    });
});

router.put("/:id", validatePostId, (req, res) => {
  const changes = req.body;
  Posts.update(req.params.id, changes)
    .then(() => {
      Posts.getById(req.params.id).then((post) => {
        res.status(200).json(post);
      });
    })
    .catch((error) => {
      res.status(500).json({error: "The post could not be modified."});
    });
});

// custom middleware

function validatePostId(req, res, next) {
  Posts.getById(req.params.id).then((post) => {
    if (!post) {
      res.status(400).json({message: "invalid post id"});
    } else {
      next();
    }
  });
}

module.exports = router;
