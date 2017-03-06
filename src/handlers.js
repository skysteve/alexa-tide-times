/**
 * Created by steve on 06/03/2017.
 */

exports = {
  LaunchRequest() {
    this.emit(':tellWithCard', 'Welcome to tide times', 'Tide Times', 'See http://www.ukho.gov.uk/easytide/EasyTide/ShowPrediction.aspx');
  },
  BothTimes() {
    const city = this.event.request.intent.slots.City.value;
    const speachReply = `the tide time in ${city} is coming soon`;
    this.emit(':tellWithCard', speachReply, 'Tide Times', speachReply);
  },
  HighTide() {
    const city = this.event.request.intent.slots.City.value;
    const speachReply = `High tide in ${city} is coming soon`;
    this.emit(':tellWithCard', speachReply, 'Tide Times', speachReply);
  },
  LowTide() {
    const city = this.event.request.intent.slots.City.value;
    const speachReply = `Low tide in ${city} is coming soon`;
    this.emit(':tellWithCard', speachReply, 'Tide Times', speachReply);
  }
};
