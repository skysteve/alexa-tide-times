'use strict';

const locationManager = require('./locationManager');
const tideManger = require('./tideManager');

function getLocation(intent) {
  return locationManager.getNearestMatch(intent.slots.Location.value);
}

function formatTimes(arrTimes) {
  return arrTimes.map((t) => t.time).join(', and ');
}

module.exports = {
  LaunchRequest() {
    this.emit(':tellWithCard', 'Welcome to tide times', 'Tide Times', 'See http://www.ukho.gov.uk/easytide/EasyTide/ShowPrediction.aspx');
  },
  BothTimes() {
    const location = getLocation(this.event.request.intent);

    tideManger.getTideTimes(location)
      .then((result) => {
        let speechReply;
        if (result.highTimes.length < 1 && result.lowTimes.length < 1) {
          speechReply = `There are no tide times for ${location}`;
        } else {
          speechReply = `Today in ${location}
          high tide is at ${formatTimes(result.highTimes)}.
          Low tide is at ${formatTimes(result.lowTimes)}`;
        }

        this.emit(':tellWithCard', speechReply, 'Tide Times', speechReply);
      })
      .catch((ex) => {
        console.error(ex);
        this.emit(':tellWithCard', `Failed to load tide times for ${location}`, 'Tide Times', `Failed to load tide times for "${location}"`);
      });
  },
  HighTide() {
    const location = getLocation(this.event.request.intent);

    tideManger.getTideTimes(location)
      .then((result) => {
        let speechReply;
        if (result.highTimes.length < 1) {
          speechReply = `There are no tide times for ${location}`;
        } else {
          speechReply = `Today in ${location}
          high tide is at ${formatTimes(result.highTimes)}.`;
        }

        this.emit(':tellWithCard', speechReply, 'Tide Times', speechReply);
      })
      .catch((ex) => {
        console.error(ex);
        this.emit(':tellWithCard', `Failed to load tide times for ${location}`, 'Tide Times', `Failed to load tide times for "${location}"`);
      });
  },
  LowTide() {
    const location = getLocation(this.event.request.intent);

    tideManger.getTideTimes(location)
      .then((result) => {
        let speechReply;
        if (result.highTimes.length < 1 && result.lowTimes.length < 1) {
          speechReply = `There are no tide times for ${location}`;
        } else {
          speechReply = `Today in ${location}
          low tide is at ${formatTimes(result.lowTimes)}`;
        }

        this.emit(':tellWithCard', speechReply, 'Tide Times', speechReply);
      })
      .catch((ex) => {
        console.error(ex);
        this.emit(':tellWithCard', `Failed to load tide times for ${location}`, 'Tide Times', `Failed to load tide times for "${location}"`);
      });
  },
  Unhandled() {
    this.emit(':tell', 'Sorry, I failed to understand your query, please try again');
  }
};
