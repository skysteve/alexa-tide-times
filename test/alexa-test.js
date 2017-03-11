/**
 * Created by steve on 11/03/2017.
 */
const fn = require('../index').handler;

const request = {
  "session": {
    "sessionId": "SessionId.4133dbd5-0c20-4620-b139-9306ba1a88fe",
    "application": {
      "applicationId": "amzn1.ask.skill.db89c6a4-cb8e-42fd-9d31-ec4ef865b4c6"
    },
    "attributes": {},
    "user": {
      "userId": "amzn1.ask.account.AGU2C6SDMUEH7AALSPTCC45G7D4UVEUORCYB6EOMZNYRFE7YDCNASWFHGXIIIZSVTMR5FEVFNLH67UKBBSPFAYL4YWW5HHMUSMD2WSWPTBBVIO5TQ7P6I7QSTNJLUBFYZFUAMJ76ONCN37M3SVHGBAVJHGVGS36TFGNAB26SKW7N6IZNZ7Y655WPQUAAEBRU4F72RI6OT6BJZBQ"
    },
    "new": true
  },
  "request": {
    "type": "IntentRequest",
    "requestId": "EdwRequestId.f8ac48b6-124d-4e81-a68f-c18016cb62be",
    "locale": "en-GB",
    "timestamp": "2017-03-11T14:01:43Z",
    "intent": {
      "name": "BothTimes",
      "slots": {
        "Location": {
          "name": "Location"
        }
      }
    }
  },
  "version": "1.0"
};

fn(request);
