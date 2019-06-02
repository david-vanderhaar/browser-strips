import uuid from 'uuid/v1';

// COMPOUND TASK
  // has preconditions (FUNCTION)
  // has subtasks (TASK/COMPOUND TASK)
  // has method (FUNCTION)
  
// TASK
  // has operators (FUNCTION)

// METHOD - heuristic function used to choose subtask (defaults to random)

// OPERATOR - bottom line, manipulates state of entity

// ENTITY - an actor that uses tasks from the DOMAIN to satisfy it's heuristics

// DOMAIN

// ENGAGEMENT

export const getPlan = (domain, tasks, entity, worldState) => {
  let plan = [];
  for (let i = 0; i < tasks.length; i++) {
    if (domain.hasOwnProperty(tasks[i])) { // if task exists in domain
      if (domain[tasks[i]].meetsPreconditions(entity, worldState)) {
        if (domain[tasks[i]].hasOwnProperty('tasks')) {
          tasks = tasks.concat(domain[tasks[i]].heuristic(domain[tasks[i]], entity, worldState))
        } else {
          plan.push(tasks[i])
        }
      } else {
        plan.push('FAIL')
        console.log(`${tasks[i]} not available`);
      }
    } else {
      plan.push('DOES_NOT_EXIST')
      console.log(`${tasks[i]} does not exist in this domain`);
    }
  }

  return plan;
}

export const executePlan = (domain, plan, entity, worldState) => {
  let planExecuted = false;
  if (entity.willReplan) {
    entity.setWillReplan(false);
  } else {
    plan.map((step) => {
      domain[step].operate(entity, worldState);
      entity['log'] = entity['log'] ? [...entity['log'], step] : [step];
    });
    planExecuted = true;
  }
  return planExecuted;
}

export const createWorldState = (initialState) => {
  if (!initialState.hasOwnProperty('entities')) {
    throw new Error('Initial world state expects an array of entity objects.');
  }
  if (!Array.isArray(initialState.entities)) {
    throw new Error('Initial world state expects an array of entity objects.');
  }
  if (!initialState.hasOwnProperty('engagements')) {
    throw new Error('Initial world state expects an array of engagement objects.');
  }
  if (!Array.isArray(initialState.engagements)) {
    throw new Error('Initial world state expects an array of engagement objects.');
  }
  const entities = initialState.entities;
  const engagements = initialState.engagements;
  return {
    entities,
    engagements,
    ...initialState,
  }
}

export const createDomain = (initialDomain) => {
  let FAIL = false;
  let DOES_NOT_EXIST = false;

  if (!initialDomain.hasOwnProperty('FAIL')) {
    console.log('A FAIL task has been added to your domain. You may override it as a primitive task.');
    FAIL = { // required by planner
      meetsPreconditions: () => true,
      operate: () => null,
    }
  } else {
    FAIL = initialDomain.FAIL;
  }

  if (!initialDomain.hasOwnProperty('DOES_NOT_EXIST')) {
    console.log('A DOES_NOT_EXIST task has been added to your domain. You may override it as a primitive task.');
    DOES_NOT_EXIST = { // required by planner
      meetsPreconditions: () => true,
      operate: () => null,
    }
  } else {
    DOES_NOT_EXIST = initialDomain.DOES_NOT_EXIST;
  }

  return {
    FAIL,
    DOES_NOT_EXIST,
    ...initialDomain,
  };
}

export const createTask = () => {
  // Every task requires
  // Function meetsPreconditions
  // Function operate
}

export const createCompoundTask = () => {
  // Every compound task requires
  // Function meetsPreconditions
  // Function heuristic to decide which sub task to plan
  // Array String tasks
}

export const createEntity = (entity) => {
  entity['id'] = uuid()
  entity['willReplan'] = false
  entity['setOwnValue'] = (key, value) => {
    entity[key] = value;
  }
  entity['recieveValueFrom'] = (from, key, value) => {
    entity.setOwnValue(key, value);
    entity.setWillReplan(true);
  }
  entity['setWillReplan'] = (value) => {
    entity.willReplan = value;
  }

  return entity;
}

export const createEngagement = ({ task, initiatedBy, target, initiatedTime, resolvedTime }, resolvedWith = false, ) => {
  return {
    id: uuid(),
    task,
    initiatedBy,
    initiatedTime,
    target,
    resolvedWith,
    resolvedTime,
  };
}

export const getEngagementsByTask = (task, engagements) => {
  return engagements.filter((engagement) => engagement.task === task);
}

export const getEngagementsByResolution = (resolvedWith, engagements) => {
  return engagements.filter((engagement) => engagement.resolvedWith === resolvedWith);
}

export const getEngagementsByTarget = (target, engagements) => {
  return engagements.filter((engagement) => engagement.target === target);
}

export const getEngagementsByTaskAndResolution = (task, resolved, engagements) => {
  return getEngagementsByResolution(resolved, getEngagementsByTask(task, engagements));
}
