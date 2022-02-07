// setup 
var express = require('express');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const { v4: uuidv4 } = require('uuid');
const url= require('url');
const axios = require('axios');
const { response } = require('express');

// init
const backendId = uuidv4();
const backendOrdinal = process.env.BACKEND_ORDINAL || Math.floor(Math.random() * (255 - 1 + 1) + 1);
const myLoggerFormat = printf(({ level, message, label, timestamp }) => { return `${timestamp} [${level}] ${message}`; });
const logger = createLogger( {
  format: combine(timestamp({format: 'YYYY-MM-DD HH:mm:ss-SS'}),myLoggerFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'helloer.log' })
  ]});
const appPort = process.env.HTTPORT || 8080;



// hello message handler
helloHandler = function(req,res) {

  logger.info("recv hello request");
  
  var sourceIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "unknown" ;
  var respTime = new Date().toISOString();
  var respId = uuidv4();

  var responsePayload = { 
    'backend-id' : backendId, 
    'backend-num' : backendOrdinal, 
    'request-source-ip' : sourceIp,
    'response-id' : respId, 
    'response-message': "hello-client", 
    'response-date': respTime 
  }
  res.json(responsePayload);
  
  logger.info("sent hello response id="+respId+" to client from ip="+sourceIp);
}

githandler = function(req,res) {

  const queryObject = url.parse(req.url, true).query;
  const githubUsername = queryObject['username'];
  logger.info("recv git api request for user "+githubUsername);
  var callUrl = "https://api.github.com/users/"+githubUsername+"/repos";

  logger.info("retriving user "+githubUsername+" repos from github");
  axios.get(callUrl).then(resAxios => {
    var repoCount = resAxios.data.length;
    var reposArray = [];
    for (var a=0;a<repoCount;a++) {
      var oneRepo = {
        'id' : resAxios.data[a].id,
        'name' : resAxios.data[a].name,
        'url' : resAxios.data[a].html_url
      };
      reposArray.push(oneRepo);
    }
    var responsePayload = {
      'user' : githubUsername,
      'repo_count' : reposArray.length,
      'repos' : reposArray
    };
    res.json(responsePayload);
    logger.info("sent git api request, found "+responsePayload.length+" repos for user "+githubUsername);
  })
  .catch(err => {
    logger.error("error while fetching data from github " + err);
    var responsePayload = {
      'error' : 'unable to fetch repos for user '+githubUsername,
      'github_url' : err.config.url,
      'github_method' :  err.config.method,
      'github_error' : err.message
    };
    res.status(500).json(responsePayload);
  });
}

// app 
logger.info("starting backend id="+backendId+" ordinal="+backendOrdinal);
var app = express();
app.get('/hello', helloHandler);
app.get('/github/repos',githandler);
app.listen(appPort);
logger.info("started backend id="+backendId+" ordinal="+backendOrdinal+" on port="+appPort);
