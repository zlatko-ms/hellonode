// setup 
var express = require('express');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const { v4: uuidv4 } = require('uuid');

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

// app 
logger.info("starting backend id="+backendId+" ordinal="+backendOrdinal);
var app = express();
app.get('/hello', helloHandler);
app.listen(appPort);
logger.info("started backend id="+backendId+" ordinal="+backendOrdinal+" on port="+appPort);
