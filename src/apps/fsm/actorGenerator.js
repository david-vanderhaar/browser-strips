import uuid from 'uuid/v1';
import * as Fsm from './fsm';
import * as Helper from './helper';

const TRAIT_MIN = 0;
const TRAIT_MAX = 10;

export function createEntity() {

  let actor = {
    id: uuid(),
    name: composeName([namePrefixes, nameSuffixes]),
    gold: Helper.getRandomIntInclusive(10, 1000),
    gold_needed: 0,
    armies: 0,
    armies_needed: Helper.getRandomIntInclusive(1, 10),
    population: Helper.getRandomIntInclusive(1000, 500000),
    taxes: [
      {
        name: 'citizen\'s tax', 
        value: 0.05,
      },
      {
        name: 'kings\'s tax', 
        value: 0.02,
      },
    ],
    territories: Helper.getRandomIntInclusive(1, 5),
    action_points: 20,
    states: null,
    traits: {
      honor: Helper.getRandomIntInclusive(TRAIT_MIN, TRAIT_MAX),
      glory: Helper.getRandomIntInclusive(TRAIT_MIN, TRAIT_MAX),
      greed: Helper.getRandomIntInclusive(TRAIT_MIN, TRAIT_MAX),
      frugality: Helper.getRandomIntInclusive(TRAIT_MIN, TRAIT_MAX),
      war_mongering: Helper.getRandomIntInclusive(TRAIT_MIN, TRAIT_MAX),
    },
  }

  actor.states = {
    main: new Fsm.Fsm({ actor })
  }
  actor.update = (world_state) => {
    const current_state = actor.states.main.state;
    Fsm[current_state](actor, world_state);
  }
  return actor;
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