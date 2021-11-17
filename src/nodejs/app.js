// setup 
var express = require('express');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const { v4: uuidv4 } = require('uuid');

// init
const backendId = uuidv4();
const backendOrdinal = process.env.BACKEND_ORDINAL || Math.floor(Math.random() * (255 - 1 + 1) + 1);
const myLoggerFormat = printf(({ level, message, label, timestamp }) => { return `${timestamp} [${level}] ${message}`; });
const logger = createLogger({format: combine(timestamp({format: 'YYYY-MM-DD HH:mm:ss-SS'}),myLoggerFormat),transports: [new transports.Console()]});
const appPort = process.env.HTTPORT || 8080;

// hello message handler
helloHandler = function(req,res) {
  logger.info("recv hello request from ip="+sourceIp);
  var sourceIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "unknown" ;
  var responsePayload = { backendid : backendId, backendnum : backendOrdinal, resSource : sourceIp, message: "hello-client" }
  res.json(responsePayload);
  logger.info("sent hello response to client from ip="+sourceIp);
}

// app 
logger.info("starting backend id="+backendId+" ordinal="+backendOrdinal);
var app = express();
app.get('/hello', helloHandler);
app.listen(appPort);
logger.info("started backend id="+backendId+" ordinal="+backendOrdinal+" on port="+appPort);
