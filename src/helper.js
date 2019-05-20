import uuid from 'uuid/v1';

export function createEntity() {
  return ({
    id: uuid(),
    name: composeName([namePrefixes, nameSuffixes]),
    gold: getRandomIntInclusive(10, 1000),
    gold_needed: 0,
    armies: getRandomIntInclusive(0, 10),
    armies_needed: 0,
    honor: getRandomIntInclusive(0, 10),
    glory: getRandomIntInclusive(0, 10),
    territories: getRandomIntInclusive(1, 5),
  });
}

const namePrefixes = [
  'Moon',
  'Sun',
  'Black',
  'White',
  'Light',
  'Shadow',
  'Red',
  'Green',
  'Gray',
  'Mighty',
  'Wither',
  'Gale',
  'Hay',
  'Stone',
  'River',
]

const nameSuffixes = [
  'Fire',
  'Water',
  'Belly',
  'Peaks',
  'Born',
  'Still',
  'Wood',
  'Wine',
  'Run',
  'Guard',
  'Fell',
  'Fall',
]

const composeName = (namePartLists = []) => {
  return namePartLists.map((list) => randomArrayValue(list)).join(' ')
}

const randomArrayValue = (list = []) => {
  return list[Math.floor(Math.random() * list.length)];
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; 
}