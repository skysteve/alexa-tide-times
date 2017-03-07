'use strict';

const tideManger = require('./tideManager');

module.exports = {
  LaunchRequest() {
    this.emit(':tellWithCard', 'Welcome to tide times', 'Tide Times', 'See http://www.ukho.gov.uk/easytide/EasyTide/ShowPrediction.aspx');
  },
  BothTimes() {
    const city = this.event.request.intent.slots.Location.value;

    tideManger.getTideTimes(city)
      .then((result) => {
        let speechReply;
        if (result.highTimes.length < 1 && result.lowTimes.length < 1) {
          speechReply = `There are no tide times for ${city}`;
        } else {
          speechReply = `Today in ${city}
          high tide is at ${result.highTimes.map((t) => t.time).join(', ')}.
          Low tide is at ${result.lowTimes.map((t) => t.time).join(', ')}`;
        }

        this.emit(':tellWithCard', speechReply, 'Tide Times', speechReply);
      })
      .catch((ex) => {
        console.error(ex);
        this.emit(':tellWithCard', `Failed to load tide times for ${city}`, 'Tide Times', `Failed to load tide times for ${city}`);
      });
  },
  HighTide() {
    const city = this.event.request.intent.slots.Location.value;

    tideManger.getTideTimes(city)
      .then((result) => {
        let speechReply;
        if (result.highTimes.length < 1 && result.lowTimes.length < 1) {
          speechReply = `There are no tide times for ${city}`;
        } else {
          speechReply = `Today in ${city}
          high tide is at ${result.highTimes.map((t) => t.time).join(', ')}.`;
        }

        this.emit(':tellWithCard', speechReply, 'Tide Times', speechReply);
      })
      .catch((ex) => {
        console.error(ex);
        this.emit(':tellWithCard', `Failed to load tide times for ${city}`, 'Tide Times', `Failed to load tide times for ${city}`);
      });
  },
  LowTide() {
    const city = this.event.request.intent.slots.Location.value;

    tideManger.getTideTimes(city)
      .then((result) => {
        let speechReply;
        if (result.highTimes.length < 1 && result.lowTimes.length < 1) {
          speechReply = `There are no tide times for ${city}`;
        } else {
          speechReply = `Today in ${city}
          low tide is at ${result.lowTimes.map((t) => t.time).join(', ')}`;
        }

        this.emit(':tellWithCard', speechReply, 'Tide Times', speechReply);
      })
      .catch((ex) => {
        console.error(ex);
        this.emit(':tellWithCard', `Failed to load tide times for ${city}`, 'Tide Times', `Failed to load tide times for ${city}`);
      });
  },
  Unhandled() {
    this.emit(':tell', 'Sorry, I failed to understand your query, please try again');
  }
};
