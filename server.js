const express = require("express");
const usersRouter = require("./users/userRouter.js");
const postsRouter = require("./posts/postRouter.js");
const cors = require("cors");

const server = express();
server.use(logger);
server.use(express.json());
server.use(cors());

server.use("/users", usersRouter);
server.use("/posts", postsRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware
//logger - Date, Type of request, Requst url & Origin
function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
      "Origin"
    )}`
  );

  next();
}

module.exports = server;
