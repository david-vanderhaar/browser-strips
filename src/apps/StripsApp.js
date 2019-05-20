import React from 'react';
import strips from '../lib/strips';
import domainParser from '../strips/domainParser';
import problemParser from '../strips/problemParser';
import * as helper from '../helper';
import getDomainText from '../strips/domain';
import getProblemText from '../strips/problem';

class StripsApp extends React.Component {

  componentDidMount () {
    const nations = new Array(10).fill('').map((i) => {
      const nation = helper.createEntity();
      return nation;
    });
    console.table(nations);

    // console.log(grammar());
    
    let domain = domainParser.parse(getDomainText());
    console.log('domain', domain);
    let problem = problemParser.parse(getProblemText());
    console.log('problem', problem);

    strips.loadFromJson(domain, problem, function (domain, problem) {
      // Run the problem against the domain, using depth-first-search.
      var solutions = strips.solve(domain, problem);
      // Display each solution.
      for (var i in solutions) {
        var solution = solutions[i];
        console.log('- Solution found in ' + solution.steps + ' steps!');
        for (var i = 0; i < solution.path.length; i++) {
          console.log((i + 1) + '. ' + solution.path[i]);
        }
      }
    });
  }

  render() {
    return (
      <p>
        STRIPS
      </p>
    );
  }
}

export default StripsApp;
