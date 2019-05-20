import stateMachine from 'javascript-state-machine';
import * as Helper from './helper';

export class Fsm extends stateMachine {
  constructor(actor) {
    super({
      init: 'maintaining_status_quo',
      transitions: [
        { name: 'maintain_status_quo', from: '*', to: 'maintaining_status_quo' },
        { name: 'increase_military_strength', from: '*', to: 'increasing_military_strength' },
        { name: 'increase_wealth', from: '*', to: 'increasing_wealth' },
        { name: 'increase_tax', from: '*', to: 'increasing_tax' },
        { name: 'collect_tax', from: '*', to: 'collecting_tax' },
        { name: 'decrease_expenses', from: '*', to: 'decreasing_expenses' },
        { name: 'increase_territory', from: '*', to: 'increasing_territory' },
      ],
      methods: {
        onMaintainStatusQuo: () => {
          console.log('will maintain status quo')
        },
        onIncreaseMilitaryStrength: () => {
          console.log('will increase military strength')
        },
        onIncreaseWealth: () => {
          console.log('will increase wealth')
        },
        onIncreaseTax: () => {
          console.log('will increase tax')
        },
        onCollectTax: () => {
          console.log('will collect tax')
        },
        onDecreaseExpenses: () => {
          console.log('will decrease expenses')
        },
      }
    })
    this.actor = actor;
  }
}

// State funcs
// UPKEEP
export function maintaining_status_quo(actor, world_state) {
  const revenue = calculateIncome(actor, [calculateIncomeFromTax]) - calculateExpenses(actor, [calculateExpensesFromArmies])
  actor.gold += revenue;
  actor.gold_needed = Math.max(0, actor.gold_needed - revenue);
  return chooseMotivation(actor, MOTIVES);
}

// WEALTH
export function increasing_wealth(actor, world_state) {
  return chooseMotivation(actor, MOTIVES);
}

export function increasing_tax (actor) {
  if (actor.taxes.length > 0) {
    actor.taxes[Helper.getRandomIntInclusive(0, actor.taxes.length - 1)].value += 0.01;
  }
  return chooseMotivation(actor, MOTIVES);
}

export function collecting_tax (actor) {
  if (actor.taxes.length > 0) {
    const income_from_tax = calculateIncomeFromTax(actor);
    actor.gold += income_from_tax;
    actor.gold_needed = Math.max(0, actor.gold_needed - income_from_tax);
  }
  return chooseMotivation(actor, MOTIVES);
}

// export function adding_tax (actor) {
  // add random tax via random tax generator
  // }
  
export function decreasing_expenses (actor) {
  actor.armies = Math.max(0, actor.armies - 1);
  return chooseMotivation(actor, MOTIVES);
}

// MILITARY
export function increasing_military_strength(actor, world_state) {
  if (actor.gold >= 250) {
    actor.gold -= 250;
    actor.armies += 1;
    actor.armies_needed = Math.max(0, actor.armies_needed - 1);
    console.log('success');
  } else {
    actor.gold_needed += 250 - actor.gold;
    console.log('fail');
  }
  console.log(actor.gold_needed);
  
  return chooseMotivation(actor, MOTIVES);
}

// Motivation checks
const desiresWealth = ({ gold, gold_needed, traits }) => {
  return (gold_needed > 0) // * Math.random(); // + traits.greed;
  // return (gold_needed > 0) + Helper.getRandomIntInclusive(0, 10) // * Math.random(); // + traits.greed;
}

const desiresIncreaseTax = ({traits}) => {
  // return traits.greed - traits.honor; // minus tax resistance
  return Helper.getRandomIntInclusive(0, 10);
}

const desiresCollectTax = ({traits}) => {
  // return traits.greed
  return Helper.getRandomIntInclusive(0, 10);
}

const desiresDecreaseExpenses = ({traits}) => {
  // return traits.frugality
  return Helper.getRandomIntInclusive(0, 10);
}

const desiresMilitaryStrength = ({ gold_needed, armies_needed, traits }) => {
  return (armies_needed > 0 && gold_needed <= 0) // * Math.random(); // + traits.war_mongering;
  // return (armies_needed > 0) + Helper.getRandomIntInclusive(0, 10) // * Math.random(); // + traits.war_mongering;
}

const MOTIVES = [
  {
    transition: 'increaseWealth',
    calculate: (actor) => desiresWealth(actor),
    sub_motives: [
      // {
      //   transition: 'increaseTax',
      //   calculate: (actor) => desiresIncreaseTax(actor),
      // },
      {
        transition: 'collectTax',
        calculate: (actor) => desiresCollectTax(actor),
      },
      // {
      //   transition: 'decreaseExpenses',
      //   calculate: (actor) => desiresDecreaseExpenses(actor),
      // }
    ],
  },
  {
    transition: 'increaseMilitaryStrength',
    calculate: (actor) => desiresMilitaryStrength(actor),
  },
];

export function rankMotivations(actor, motives) {
  return motives.sort((motive_a, motive_b) => motive_b.calculate(actor) - motive_a.calculate(actor));
}

export function chooseMotivation(actor, motives) {
  const sorted_motives = rankMotivations(actor, motives);
  if (sorted_motives.length > 0) {
    if (sorted_motives[0].hasOwnProperty('sub_motives') && sorted_motives[0].sub_motives.length > 0) {
      chooseMotivation(actor, sorted_motives[0].sub_motives);
    } else {
      actor.states.main[sorted_motives[0]['transition']]() 
    }
  } else {
    actor.states.main.maintainStatusQuo();
  }
}

// helpers
const calculateExpenses = (actor, expenses) => {
  return expenses.reduce((accumulator, current) => {
    return accumulator(actor) + current(actor);
  }, () => 0);
}

const calculateExpensesFromArmies = ({armies}) => armies * 25;

const calculateIncome = (actor, incomes) => {
  return incomes.reduce((accumulator, current) => {
    return accumulator(actor) + current(actor)
  }, () => 0);
}

const calculateIncomeFromTax = ({population, taxes}) => {
  return (
    Math.ceil(
      population * 
      taxes.map((tax) => tax.value).reduce((accumulator, current) => accumulator + current, 0) /
      1000
    )
  )
}


