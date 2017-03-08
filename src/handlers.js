'use strict';

const locationManager = require('./locationManager');
const tideManger = require('./tideManager');

const FAV_LOCATION_KEY = 'favourite_location';
const UNKNOWN_LOC_REPLY = 'Sorry, I didn\'t hear a location and you haven\'t set a favourite yet. You can set a favourite by saying "Alexa ask tide times to set my favourite location as Place"';
const CARD_TITLE = 'Tide Times';

function getLocation(intent, returnDefault, favLoc) {
  return locationManager.getNearestMatch(intent.slots.Location.value, returnDefault) || favLoc;
}

function formatTimes(arrTimes) {
  return arrTimes.map((t) => `${t.time} at a height of ${t.height}`).join(', and ');
}

module.exports = {
  LaunchRequest() {
    this.emit(':tellWithCard', 'Welcome to tide times', CARD_TITLE, 'See http://www.ukho.gov.uk/easytide/EasyTide/ShowPrediction.aspx');
  },
  BothTimes() {
    const location = getLocation(this.event.request.intent, true, this.attributes[FAV_LOCATION_KEY]);

    if (!location) {
      return this.emit(':tellWithCard', UNKNOWN_LOC_REPLY, CARD_TITLE, UNKNOWN_LOC_REPLY);
    }

    tideManger.getTideTimes(location)
      .then((result) => {
        let speechReply;
        let cardText;
        if (result.highTimes.length < 1 && result.lowTimes.length < 1) {
          speechReply = `There are no tide times for ${location}.`;
          cardText = speechReply;
        } else {
          speechReply = `Today in ${location}
          High tide is at ${formatTimes(result.highTimes)}.
          Low tide is at ${formatTimes(result.lowTimes)}.`;

          cardText = `Today in ${location}
          High tide is at ${formatTimes(result.highTimes).toLowerCase()}.
          Low tide is at ${formatTimes(result.lowTimes).toLowerCase()}.`
            .replace(/ meters/g, 'm')
            .replace(/at a height of /g, '(')
            .replace(/,/g, '),')
            .replace(/\.$/g, ').');
        }

        this.emit(':tellWithCard', speechReply, 'Tide Times', cardText);
      })
      .catch((ex) => {
        console.error(ex);
        this.emit(':tellWithCard', `Failed to load tide times for ${location}`, CARD_TITLE, `Failed to load tide times for "${location}"`);
      });
  },
  HighTide() {
    const location = getLocation(this.event.request.intent, true, this.attributes[FAV_LOCATION_KEY]);

    if (!location) {
      return this.emit(':tellWithCard', UNKNOWN_LOC_REPLY, CARD_TITLE, UNKNOWN_LOC_REPLY);
    }

    tideManger.getTideTimes(location)
      .then((result) => {
        let speechReply;
        if (result.highTimes.length < 1) {
          speechReply = `There are no tide times for ${location}`;
        } else {
          speechReply = `Today in ${location}
          High tide is at ${formatTimes(result.highTimes)}.`;
        }

        this.emit(':tellWithCard', speechReply, 'Tide Times', speechReply);
      })
      .catch((ex) => {
        console.error(ex);
        this.emit(':tellWithCard', `Failed to load tide times for ${location}`, CARD_TITLE, `Failed to load tide times for "${location}"`);
      });
  },
  LowTide() {
    const location = getLocation(this.event.request.intent, true, this.attributes[FAV_LOCATION_KEY]);

    if (!location) {
      return this.emit(':tellWithCard', UNKNOWN_LOC_REPLY, CARD_TITLE, UNKNOWN_LOC_REPLY);
    }

    tideManger.getTideTimes(location)
      .then((result) => {
        let speechReply;
        if (result.highTimes.length < 1 && result.lowTimes.length < 1) {
          speechReply = `There are no tide times for ${location}`;
        } else {
          speechReply = `Today in ${location}
          Low tide is at ${formatTimes(result.lowTimes)}.`;
        }

        this.emit(':tellWithCard', speechReply, 'Tide Times', speechReply);
      })
      .catch((ex) => {
        console.error(ex);
        this.emit(':tellWithCard', `Failed to load tide times for ${location}`, CARD_TITLE, `Failed to load tide times for "${location}"`);
      });
  },
  SaveFavourite() {
    const location = getLocation(this.event.request.intent, false);

    if (!location) {
      return this.emit(':tell', `Sorry I couldn't find tide time for ${location}`);
    }

    this.attributes[FAV_LOCATION_KEY] = location;
    this.emit(':saveState', true);
    this.emit(':tell', `Your favourite location has been saved as ${location}`);
  },
  Unhandled() {
    this.emit(':tell', 'Sorry, I failed to understand your query, please try again');
  }
};
