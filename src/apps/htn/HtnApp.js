import React from 'react';
import '../../App.css';
import * as actorGen from './actorGenerator';
import * as planner from './planner';
import * as villager from './domains/villager';

class HtnApp extends React.Component {

  componentDidMount () {
    // const nations = new Array(10).fill('').map((i) => {
    //   const nation = actorGen.createEntity();
    //   return nation;
    // });
    // console.table(nations);

    let worldState = planner.createWorldState({
      entities: [
        villager.createVillager({ items: [{ name: 'gem', value: 30 }] }),
        villager.createVillager({ name: 'Tinn', loneliness: 0, items: [{ name: 'stick', value: 1 }] }),
        villager.createVillager({ name: 'Quan', items: [{ name: 'machine', value: 1000 }] }),
        villager.createVillager({ name: 'Forest', items: [{ name: 'coin', value: 10 }] }),
        villager.createVillager({ name: 'Fivulo', items: [{ name: 'coin', value: 50 }] }),
      ],
      engagements: [],
      timestep: 0,
    });

    let domain = planner.createDomain(villager.domain);

    Array(30).fill('').map((hour) => {
      worldState.entities.map((entity) => {
        let plan = planner.getPlan(domain, ['hour'], entity, worldState);
        let successfullyExecuted = planner.executePlan(domain, plan, entity, worldState);
        let max = 0;
        while (!successfullyExecuted && max <= 100) {
          max += 1;
          plan = planner.getPlan(domain, ['hour'], entity, worldState);
          successfullyExecuted = planner.executePlan(domain, plan, entity, worldState);
        }
      })
      worldState.timestep += 1;
    })
    
    // console.log(worldState.entities[0].log)
    // console.log(worldState.entities[0].engagements)
    // console.log(worldState.entities[1].log)
    // console.log(worldState.entities[1].engagements)
    // console.log(worldState.entities[2].log)
    // console.log(worldState.entities[2].engagements)
    console.table(worldState.engagements);
    

    
  }

  render() {
    return (
      <p>
        HTN
      </p>
    );
  }
}

export default HtnApp;
