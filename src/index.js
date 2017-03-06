/**
 * Created by steve on 06/03/2017.
 */
const Alexa = require('alexa-sdk');
const handlers = require('./handlers');

exports.handler = (event, context/* , callback*/) => {
  const alexa = Alexa.handler(event, context);
  alexa.appId = process.env.ALEXA_SKILL_ID;

  alexa.registerHandlers(handlers);
  alexa.execute();
};
