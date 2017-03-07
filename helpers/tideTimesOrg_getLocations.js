let ulList = document.querySelector('#allports');
let locations = ulList.querySelectorAll('li a');
let result = [];
locations.forEach(l => result.push(l.textContent));

result = result.filter(l => !!l);

JSON.stringify(result, null, 1).replace(/"/g, '').replace(/,/g, '');
