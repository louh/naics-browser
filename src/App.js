import React, { Component } from 'react'
import './App.css'
import Search from './Search'

class App extends Component {
  constructor () {
    super()

    this.state = {
      year: 2012 // TODO: don't hardcode
    }
  }

  render () {
    return (
      <div role="main" className="viewport">
        <div className="left-column">
          <h1><a href="?">NAICS Browser</a></h1>
          <Search year={this.state.year} />
        </div>
        <div className="right-column">
          <div id="frontpage">
            <div className="crumbs">
              Introduction
            </div>

            <p>
              This is an alternative to the NAICS website hosted by the <a href="http://www.census.gov/eos/www/naics/index.html" target="_blank">US Census Bureau</a>. It uses <a href="http://naics.codeforamerica.org/" target="_blank">Code for America"s NAICS API</a> to provide a more user-friendly interface. The code is <a href="https://www.github.com/louh/naics-browser" target="_blank">open source</a>.
            </p>

            <p>
              For a sample NAICS code, <a href="?year=2012&code=519120">take a look at this one.</a>
            </p>

            <ul className="pills js-naics-year-select">
              <li className="naics-year pill">2007</li>
              <li className="naics-year pill pill-selected">2012</li>
            </ul>
          </div>

          <div id="message">
          </div>

          <div className="loading" id="loading">
            <div className="loading-spinner"></div>
            <div className="loading-message">Retrieving...</div>
          </div>

          <div id="view">
          </div>
        </div>
      </div>
    );
  }
}

// <div className="App">
//   <div className="App-header">
//     <h2>Welcome to React</h2>
//   </div>
//   <p className="App-intro">
//     To get started, edit <code>src/App.js</code> and save to reload.
//   </p>
// </div>

export default App;
