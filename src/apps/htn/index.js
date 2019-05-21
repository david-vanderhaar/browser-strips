import * as helper from '../helper';
// COMPOUND TASK
  // has preconditions (FUNCTION)
  // has subtasks (TASK/COMPOUND TASK)
  // has method (FUNCTION)
  
// TASK
  // has operators (FUNCTION)

// METHOD - heuristic function used to choose subtask (defaults to random)

// OPERATOR - bottom line, manipulates state of entity

export const domain = {
  hour: {
    meetsPreconditions: () => true,
    tasks: [
      'sleep',
      'getFood',
      'getGold',
    ],
    heuristic: (task, {isTired, isHungry}) => {
      if (isTired) { return 'sleep' }
      if (isHungry) { return 'getFood' }
      return task.tasks[helper.getRandomIntInclusive(0, task.tasks.length - 1)]
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
      if (canHunt) { return 'hunt' }
      if (gold >= 10) { return 'learnHunting' }
      return 'getGold';
    },
  },
  getGold: {
    meetsPreconditions: () => true,
    tasks: [
      'work',
      'sellItems',
    ],
    heuristic: (task, {canWork, hasJob, items}) => {
      if (canWork && hasJob) { return 'work' }
      if (items.length > 0) { return 'sellItems' }
      return 'beg'
    },
  },
  sleep: {
    operate: (entity) => entity.isTired = false,
  },
  hunt: {
    operate: (entity) => entity.isHungry = false,
  },
  learnHunting: {
    operate: (entity) => entity.canHunt = true,
  },
  work: {
    operate: (entity) => entity.gold += 2,
  },
  sellItems: {
    operate: (entity) => entity.gold += entity.items.pop().value,
  },
  beg: {
    operate: (entity) => entity.gold += 1,
  },
};

export let entity = {
  isTired: true,
  isHungry: true,
  gold: 0,
  canHunt: false,
  hasJob: false,
  canWork: true,
  items: [{name: 'gem', value: 30}],
}

export const getPlan = (domain, tasks, entity) => {
  let plan = [];
  for (let i = 0; i < tasks.length; i++) {
    if (domain[tasks[i]].hasOwnProperty('tasks')) {
      if (domain[tasks[i]].meetsPreconditions(entity)) {
        tasks.push(domain[tasks[i]].heuristic(domain[tasks[i]], entity))
      }
    } else {
      plan.push(tasks[i])
      // tasks.shift();
    }
  }

  return plan;
}

export const executePlan = (domain, plan, entity) => {
  plan.map((step) => {
    domain[step].operate(entity);
  });
}