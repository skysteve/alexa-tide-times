/**
 * Created by steve on 06/03/2017.
 */
const tideManager = require('../src/tideManager');

// TODO turn this into proper tests
tideManager.getTideTimes('hartlepool')
  .then((result) => {
    console.log('*', result);
  })
  .catch((err) => {
    console.log(err);
    return `Sorry failed to load data for ${city}`
  });
