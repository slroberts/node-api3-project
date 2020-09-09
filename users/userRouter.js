const express = require("express");

const router = express.Router();

const Users = require("./userDb.js");
const Posts = require("../posts/postDb.js");

router.post("/", validateUser, (req, res) => {
  Users.insert(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      res.status(500).json({
        error: "There was an error while saving user to the database.",
      });
    });
});

router.post("/:id/posts", validatePost, (req, res) => {
  Posts.insert({user_id: req.params.id, text: req.body.text})
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      res.status(500).json({
        error: "There was an error while saving the post to the database.",
      });
    });
});

router.get("/", (req, res) => {
  Users.get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(500).json({
        error: "Users could not be retrieved.",
      });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  Users.getById(req.user)
    .then(() => res.status(200).json(req.user))
    .catch((error) => {
      res
        .status(500)
        .json({error: "The user information could not be retrieved."});
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(500).json({error: "The user posts could not be retrieved."});
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  Users.remove(req.params.id)
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

router.put("/:id", validateUserId, (req, res) => {
  const changes = req.body;

  Users.update(req.params.id, changes)
    .then((count) => {
      if (count > 0) {
        res.status(201).json({message: "User updated"});
      }
    })
    .catch((error) => {
      res.status(500).json({error: "The user could not be modified."});
    });
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id).then((user) => {
    if (!user) {
      res.status(400).json({message: "invalid user id"});
    } else {
      req.user = user;
      next();
    }
  });
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({message: "missing user data"});
  } else if (!req.body.name) {
    res.status(400).json({message: "missing required name field"});
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({message: "missing post data"});
  } else if (!req.body.text) {
    res.status(400).json({message: "missing required text field"});
  } else {
    next();
  }
}

module.exports = router;
