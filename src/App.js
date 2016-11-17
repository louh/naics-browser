import React, { Component } from 'react'
import './App.css'
import Search from './Search'
import YearSelector from './YearSelector'

class App extends Component {
  constructor () {
    super()

    this.state = {
      year: 2012 // TODO: Set this state from params
    }

    this.selectYear = this.selectYear.bind(this)
  }

  selectYear (year) {
    this.setState({ year })
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

            <YearSelector year={this.state.year} selectYear={this.selectYear} />
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

export default App;
