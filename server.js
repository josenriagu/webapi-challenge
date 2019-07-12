// import express module
const express = require('express');
// import cors module
const cors = require('cors');
// import helmet module
const helmet = require('helmet');
// import routers
const projectRouter = require('./routers/projectRouter');
const actionRouter = require('./routers/actionRouter');

// define server
const server = express();

// tell server what to use, including middlewares for this level
// express json
server.use(express.json());
// helmet to take care of masking sensitive info;
server.use(helmet());
// cors to take care of cross-origin requests
server.use(cors())
// base endpoints
server.use('/api/projects', projectRouter);
server.use('/api/actions', actionRouter);

server.get('/', (req, res) => {
   res.send(`<h2>Welcome to my Web API Sprint Challenge!!</h2>`)
});

module.exports = server;
