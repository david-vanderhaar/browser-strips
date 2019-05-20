import React from 'react';
import logo from './logo.svg';
import './App.css';
// import StripsApp from './apps/StripsApp';
import FsmApp from './apps/fsm/FsmApp';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {/* <StripsApp /> */}
          <FsmApp />
        </header>
      </div>
    );
  }
}

export default App;
