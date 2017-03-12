'use strict';

const locationManager = require('./locationManager');
const tideManger = require('./tideManager');

const FAV_LOCATION_KEY = 'favourite_location';
const UNKNOWN_LOC_REPLY = 'Sorry, I didn\'t hear a location and you haven\'t set a favourite yet. You can set a favourite by saying "Alexa ask tide times to set my favourite location as Place"';
const CARD_TITLE = 'Tide Times';
let loc;

function getLocation(intent, returnDefault, favLoc) {
  // if there's no location slot, but there is a fav location, use that
  if (favLoc && (!intent || !intent.slots || !intent.slots.Location || !intent.slots.Location.value)) {
    console.log('failed to get location', intent);
    return favLoc;
  }

  // safety net
  if (!intent || !intent.slots || !intent.slots.Location || !intent.slots.Location.value) {
    console.log('no_loc_safety_net', intent);
    return;
  }

  return locationManager.getNearestMatch(intent.slots.Location.value, returnDefault);
}

function handleNoLocation(event) {
  console.log('No_Location - returning out');

  if (event.request.intent && event.request.intent.slots && event.request.intent.slots.Location && event.request.intent.slots.Location.value) {
    const text = `Sorry I couldn't find tide times for ${event.request.intent.slots.Location.value}. Please try a different location`;
    return this.emit(':tellWithCard', text, CARD_TITLE, text);
  }

  return this.emit(':tellWithCard', UNKNOWN_LOC_REPLY, CARD_TITLE, UNKNOWN_LOC_REPLY);
}

function formatTimes(arrTimes) {
  return arrTimes.map((t) => `${t.time} at a height of ${t.height}`).join(', and ');
}

module.exports = {
  LaunchRequest() {
    const location = getLocation(this.event.request.intent, true, this.attributes[FAV_LOCATION_KEY]);

    if (location) {
      loc = location;
      return this.emit('BothTimes');
    }

    const message = `Welcome to tide times. You can ask for today's tide times at one of over 700 locations around the British Isles.
    Would you like to hear today's tide times?`;
    this.emit(':ask', message, message);
  },
  BothTimes() {
    console.log('BothTimes: request', JSON.stringify(this.event, null, 2));

    const location = loc || getLocation(this.event.request.intent, true, this.attributes[FAV_LOCATION_KEY]);

    console.log('Location is:', location, '. favourite:', this.attributes[FAV_LOCATION_KEY]);

    if (!location) {
      return handleNoLocation.call(this, this.event);
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
          High tide is at ${formatTimes(result.highTimes).toLowerCase()}).
          Low tide is at ${formatTimes(result.lowTimes).toLowerCase()}).`
            .replace(/ meters/g, 'm')
            .replace(/at a height of /g, '(')
            .replace(/,/g, '),');
        }

        console.log('BothTimes_success');

        this.emit(':tellWithCard', speechReply, 'Tide Times', cardText);
      })
      .catch((ex) => {
        console.error(ex);
        this.emit(':tellWithCard', `Failed to load tide times. ${ex.message}`, CARD_TITLE, `Failed to load tide times ${ex.message}`);
      });
  },
  HighTide() {
    console.log('HighTide: request', JSON.stringify(this.event, null, 2));

    const location = getLocation(this.event.request.intent, true, this.attributes[FAV_LOCATION_KEY]);

    console.log('Location is:', location, '. favourite:', this.attributes[FAV_LOCATION_KEY]);

    if (!location) {
      return handleNoLocation.call(this, this.event);
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

        console.log('HighTide_success');

        this.emit(':tellWithCard', speechReply, 'Tide Times', speechReply);
      })
      .catch((ex) => {
        console.error(ex);
        this.emit(':tellWithCard', `Failed to load tide times. ${ex.message}`, CARD_TITLE, `Failed to load tide times ${ex.message}`);
      });
  },
  LowTide() {
    console.log('LowTide: request', JSON.stringify(this.event, null, 2));

    const location = getLocation(this.event.request.intent, true, this.attributes[FAV_LOCATION_KEY]);

    console.log('Location is:', location, '. favourite:', this.attributes[FAV_LOCATION_KEY]);

    if (!location) {
      return handleNoLocation.call(this, this.event);
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

        console.log('LowTide_success');

        this.emit(':tellWithCard', speechReply, 'Tide Times', speechReply);
      })
      .catch((ex) => {
        console.error(ex);
        this.emit(':tellWithCard', `Failed to load tide times. ${ex.message}`, CARD_TITLE, `Failed to load tide times ${ex.message}`);
      });
  },
  SaveFavourite() {
    console.log('SaveFavourite: request', JSON.stringify(this.event, null, 2));
    const location = getLocation(this.event.request.intent, false);

    if (!location) {
      console.log('SaveFavourite_Failed send failure');
      return this.emit(':tellWithCard', 'Sorry I didn\'t hear you properly, please try again', CARD_TITLE, 'Sorry I didn\'t hear you properly, please try again');
    }

    this.attributes[FAV_LOCATION_KEY] = location;
    this.emit(':saveState', true);
    this.emit(':tell', `Your favourite location has been saved as ${location}`);
    console.log('SaveFavourite_success favourite saved as', location);
  },
  'AMAZON.HelpIntent'() {
    const message = `You can ask for today's tide times at one of over 700 locations around the British Isles.
     You can also store your favourite location by saying "Alexa ask tide times to set my favourite location as "Port Erin", then in future you can just say "Alexa open tide times"
     Would you like to hear today's tide times?`;
    this.emit(':ask', message, message);
  },
  'AMAZON.YesIntent'() {
    this.emit(':ask', 'Great. Try saying a location such as, "Port Erin"');
  },
  'AMAZON.NoIntent'() {
    this.emit(':tell', 'Ok, see you next time!');
  },
  'AMAZON.StopIntent'() {
    this.emit(':tell', 'Goodbye!');
  },
  'AMAZON.CancelIntent'() {
    this.emit(':tell', 'Goodbye!');
  },
  Unhandled() {
    this.emit(':tell', 'Sorry, I failed to understand your query, please try again');
  }
};
