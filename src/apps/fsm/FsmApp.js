import React from 'react';
import '../../App.css';
// import * as helper from '../../helper';
import * as actorGen from './actorGenerator';

class FsmApp extends React.Component {

  componentDidMount () {
    const nations = new Array(10).fill('').map((i) => {
      const nation = actorGen.createEntity();
      return nation;
    });
    console.table(nations);

    console.log('Year ', 1);
    console.table(nations[0]);
    for (let i = 1; i <= nations[0].action_points; i++) {
      nations[0].update(nations);
    }
    console.table(nations[0]);
  }

  render() {
    return (
      <p>
        FSM
      </p>
    );
  }
}

export default FsmApp;
