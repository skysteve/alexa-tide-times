'use strict';

const feedReader = require('feed-read');
const stripTags = require('striptags');

const urlBase = 'https://www.tidetimes.org.uk/CITY-tide-times.rss';

function loadFeed(url) {
  return new Promise((resolve, reject) => {
    feedReader(url, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

function mapAndFilterTimes(times, filter) {
  // const now = moment();
  return times.filter(time => time.indexOf(filter) > -1)
    .map((tideTime) => ({
      time: tideTime.substring(tideTime.indexOf(')') + 1),
      height: tideTime.substring(tideTime.indexOf('(') + 1, tideTime.indexOf(')')).replace('m', ' meters')
    }))
    .filter(tideTime => { // filter times that have already past
      if (!tideTime.time) {
        return false;
      }

      // const time = moment(tideTime.time, 'HH:mm');

      return true; // TODO time.isSameOrAfter(now);
    });
}

module.exports = {
  getTideTimes(city) {
    if (!city) {
      throw new Error('No City');
    }

    const url = urlBase.replace('CITY', city.toLowerCase());

    console.log('loading feed from', url);

    return loadFeed(url)
      .then((feed) => {
        if (!Array.isArray(feed) || feed.length > 1) {
          console.error('failed to parse feed', JSON.stringify(feed));
          throw new Error('Failed to parse feed');
        }

        const content = stripTags(feed[0].content);
        const date = feed[0].title.substring(feed[0].title.indexOf('for ') + 4);
        const times = content.substring(content.indexOf(' - ') + 3).split(' - ');
        const highTimes = mapAndFilterTimes(times, 'High');
        const lowTimes = mapAndFilterTimes(times, 'Low');

        return {
          date,
          highTimes,
          lowTimes
        };
      });
  }
};
