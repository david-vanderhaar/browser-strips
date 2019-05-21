import React from 'react';
import '../../App.css';
import * as actorGen from './actorGenerator';
import * as htn from './index';

class HtnApp extends React.Component {

  componentDidMount () {
    // const nations = new Array(10).fill('').map((i) => {
    //   const nation = actorGen.createEntity();
    //   return nation;
    // });
    // console.table(nations);
    let entity = htn.entity;
    console.table(entity);
    // let plan = htn.getPlan(htn.domain, ['sleep', 'sellItems'], entity);
    // let plan = htn.getPlan(htn.domain, ['hour'], entity);
    // console.log('plan ', plan);
    // htn.executePlan(htn.domain, plan, entity);
    // console.table(entity);
    Array(10).fill('').map((hour) => {
      let plan = htn.getPlan(htn.domain, ['hour'], entity);
      console.log('plan ', plan);
      htn.executePlan(htn.domain, plan, entity);
      console.table(entity);
    })

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
