import uuid from 'uuid/v1';
import * as helper from '../../helper';
import * as planner from '../planner';

export const domain = {
  hour: {
    meetsPreconditions: () => true,
    tasks: [
      'sleep',
      'getFood',
      'getGold',
      'initiateChat',
      'respondToChat',
    ],
    heuristic: (task, { name, fatigue, isTired, hunger, isHungry, loneliness, isLonely }, worldState) => {
      // change name to id
      const relevantEngagments = planner.getEngagementsByTaskAndResolution('initiateChat', false, planner.getEngagementsByTarget(name, worldState.engagements));
      if (relevantEngagments.length > 0 && isLonely(loneliness)) { return ['respondToChat', 'initiateChat'] }
      if (relevantEngagments.length > 0) { return ['respondToChat'] }
      if (isTired(fatigue)) { return ['sleep'] }
      if (isHungry(hunger)) { return ['getFood'] }
      if (isLonely(loneliness)) { return ['initiateChat'] }
      return [helper.getRandomInArray(task.tasks.filter((t) => t !== 'respondToChat'))];
    },
  },
  getFood: {
    meetsPreconditions: () => true,
    tasks: [
      'hunt',
      'learnHunting',
      'getGold',
    ],
    heuristic: (task, { canHunt, gold }) => {
      if (canHunt) { return ['hunt'] }
      if (gold >= 10) { return ['learnHunting'] }
      return ['getGold'];
    },
  },
  getGold: {
    meetsPreconditions: () => true,
    tasks: [
      'work',
      'sellItems',
    ],
    heuristic: (task, { canWork, hasJob, items }) => {
      if (canWork && hasJob) { return ['work'] }
      if (items.length > 0) { return ['sellItems'] }
      return ['beg']
    },
  },
  sleep: {
    meetsPreconditions: () => true,
    operate: (entity) => {
      entity.setOwnValue('fatigue', entity.fatigue - 0.125)
      entity.setOwnValue('hunger', entity.hunger + 0.1);
    },
  },
  hunt: {
    meetsPreconditions: () => true,
    operate: (entity) => {
      entity.setOwnValue('hunger', entity.hunger - 0.5);
      entity.setOwnValue('fatigue', entity.fatigue + 0.2);
    },
  },
  learnHunting: {
    meetsPreconditions: () => true,
    operate: (entity) => {
      entity.setOwnValue('canHunt', true);
      entity.setOwnValue('hunger', entity.hunger + 0.1);
      entity.setOwnValue('fatigue', entity.fatigue + 0.05);
    },
  },
  work: {
    meetsPreconditions: () => true,
    operate: (entity) => {
      entity.setOwnValue('gold', entity.gold + 5);
      entity.setOwnValue('hunger', entity.hunger + 0.1);
      entity.setOwnValue('fatigue', entity.fatigue + 0.05);
    },
  },
  sellItems: {
    meetsPreconditions: () => true,
    operate: (entity) => {
      const indexOfItemForSale = 0;
      const goldFromSale = entity.items.map((item, i) => { if (i === indexOfItemForSale) { return item.value } } )
      const items = entity.items.filter((item, i) => i !== indexOfItemForSale);
      entity.setOwnValue('items', items);
      entity.setOwnValue('gold', entity.gold + goldFromSale);
    },
  },
  beg: {
    meetsPreconditions: () => true,
    operate: (entity) => {
      entity.setOwnValue('gold', entity.gold + 1);
      entity.setOwnValue('hunger', entity.hunger + 0.1);
      entity.setOwnValue('fatigue', entity.fatigue + 0.04);
    },
  },
  initiateChat: {
    meetsPreconditions: () => true,
    operate: (entity, worldState) => {
      const other = helper.getRandomInArray(worldState.entities.filter((e) => e.id !== entity.id));
      if (other) {
        entity.setOwnValue('loneliness', Math.max(0, entity.loneliness - 0.2));
        entity.setOwnValue('hunger', entity.hunger + 0.1);
        entity.setOwnValue('fatigue', entity.fatigue + 0.04);
        worldState.engagements = worldState.engagements.concat(planner.createEngagement({
          task: 'initiateChat',
          initiatedBy: entity.name, // change to id
          target: other.name,
          initiatedTime: worldState.timestep,
        }));
        other.setWillReplan(true);
      }
    },
  },
  respondToChat: {
    meetsPreconditions: (entity, worldState) => {
      return (
        planner.getEngagementsByTask(
          'initiateChat', 
          planner.getEngagementsByResolution(
            false, 
            planner.getEngagementsByTarget(
              entity.name, // change to id 
              worldState.engagements
            )
          )
        ).length > 0
      );
    },
    operate: (entity, worldState) => {
      const engagements = worldState.engagements
        .filter((e) => { // use planner.getEngagementsBy funcs
          return (
            !e.resolvedWith &&
            e.target === entity.name && // change to id
            e.task === 'initiateChat'
          )
        })
        .slice(0, 1);
      if (engagements.length > 0) {
        worldState.engagements = worldState.engagements.map((e) => {
          if (e.id === engagements[0].id) {
            e.resolvedWith = 'respondToChat';
            e.resolvedTime = worldState.timestep;
            entity.setOwnValue('loneliness', Math.max(0, entity.loneliness - 0.2));
            entity.setOwnValue('hunger', entity.hunger + 0.1);
            entity.setOwnValue('fatigue', entity.fatigue + 0.04);
          }
          return e;
        })
      }
    },
  },
};

export const createVillager = ({
  name = 'Dorny',
  fatigue = 1,
  hunger = 1,
  loneliness = 1,
  gold = 0,
  canHunt = false,
  hasJob = false,
  canWork = true,
  items = [],
}) => {
  return planner.createEntity({
    name,
    fatigue,
    isTired (fatigue) {
      return fatigue > 0.7;
    },
    hunger,
    isHungry (hunger) {
      return hunger > 0.3;
    },
    loneliness,
    isLonely (loneliness) {
      return loneliness > 0.8;
    },
    gold,
    canHunt,
    hasJob,
    canWork,
    items,
  });
}
