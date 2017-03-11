/**
 * Created by steve on 06/03/2017.
 */
const tideManager = require('../src/tideManager');
const locationManager = require('../src/locationManager');

const location = locationManager.getNearestMatch('douglas');

console.log(location);

// TODO turn this into proper tests
tideManager.getTideTimes(location)
  .then((result) => {
    console.log('*', result);
  })
  .catch((err) => {
    console.log(err);
    return `Sorry failed to load data for ${city}`
  });
