'use strict';

const Alexa = require('alexa-sdk');
const handlers = require('./src/handlers');

exports.handler = (event, context/* , callback*/) => {
  const alexa = Alexa.handler(event, context);
  alexa.appId = process.env.ALEXA_SKILL_ID;

  alexa.dynamoDBTableName = 'AlexaTideTimesSkill';
  alexa.registerHandlers(handlers);
  alexa.execute();
};
