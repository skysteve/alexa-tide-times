'use strict';

const feedReader = require('feed-read');

const urlBase = 'https://www.tidetimes.org.uk/CITY-tide-times.rss';

function loadFeed(url) {
  console.log('Loading feed');
  return new Promise((resolve, reject) => {
    feedReader(url, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

/**
 * Filter the tide times as per filter (High | Low) and map back to a standard structure
 * @param times {array} the array of raw times
 * @param filter {string} the filter to apply (High | Low)
 * @returns {Array|*} mapped array
 */
function mapAndFilterTimes(times, filter) {
  if (!times) {
    return [];
  }

  return times.filter(time => time.indexOf(filter) > -1)
    .map((tideTime) => {
      let time = tideTime.substring(0, tideTime.indexOf('-') - 1);
      const height = tideTime.substring(tideTime.indexOf('(') + 1, tideTime.indexOf(')')).replace('m', ' meters');
      let hours = parseInt(time.substring(0, 2), 10);
      let minutes = parseInt(time.substring(3), 10);

      if (minutes < 10) {
        minutes = `0${minutes}`;
      }

      // if before 12, add AM, if after 12, knock off 12h and add PM
      if (hours < 12) {
        time = `${hours}:${minutes} AM`;
      } else {
        // only -12 if it's not 12
        if (hours > 12) {
          hours -= 12;
        }
        time = `${hours}:${minutes} PM`;
      }

      return { height, time };
    });
}

module.exports = {
  getTideTimes(city) {
    console.log('get times', city);
    if (!city) {
      return Promise.reject('No City');
    }

    const url = urlBase.replace('CITY', city.replace(/\s/g, '-').toLowerCase());

    console.log('loading feed from', url);

    return loadFeed(url)
      .then((feed) => {
        if (!Array.isArray(feed) || feed.length > 1) {
          console.error('failed to parse feed', JSON.stringify(feed));
          throw new Error('Failed to parse feed');
        }

        const date = feed[0].title.substring(feed[0].title.indexOf('for ') + 4);
        const times = feed[0].content.match(/<br\/>(\w|\s|:|-|\(|\))*\.\w*\)/g)
          .map(match => match.replace('<br/>', ''));

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
