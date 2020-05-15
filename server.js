const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');


const server = express();
const usersRouter = require('./users/userRouter.js');
server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));

server.use(logger);

server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});


function logger(req, res, next) {
  console.log(req.method, req.url)
  next();
}



module.exports = server;







