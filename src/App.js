import React, { Component } from 'react'
import { Link } from 'react-router'
import './App.css'
import Search from './Search'
import YearSelector from './YearSelector'
import Record from './Record'

const DEFAULT_YEAR = 2012

class App extends Component {
  constructor (props) {
    super(props)

    const initialState = this.getStateFromProps(props)

    this.state = {
      year: initialState.year,
      code: initialState.code,
      recordTitle: null
    }

    this.setPageTitle = this.setPageTitle.bind(this)
    this.selectYear = this.selectYear.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.setState(this.getStateFromProps(nextProps))
  }

  componentDidUpdate () {
    this.setPageTitle()
    // this.context.router.transitionTo(`?year=${this.props.year}&code=${this.props.code}`)
  }

  getStateFromProps (props) {
    let year = DEFAULT_YEAR
    if (props.location && props.location.query && props.location.query.year) {
      year = Number(props.location.query.year)
    }

    let code = null
    if (props.location && props.location.query && props.location.query.code) {
      code = String(props.location.query.code)
    }

    return {
      year,
      code
    }
  }

  setPageTitle () {
    if (this.state.code && this.state.year && this.state.recordTitle) {
      document.title = `${this.state.code} ${this.state.recordTitle} – ${this.state.year} NAICS Browser`
    } else {
      document.title = 'NAICS Browser'
    }
  }

  selectYear (year) {
    this.setState({ year })
  }

  renderRightColumn () {
    if (this.state.year && this.state.code) {
      return <Record year={this.state.year} code={this.state.code} />
    } else {
      return (
        <div id="frontpage">
          <div className="crumbs">
            Introduction
          </div>

          <p>
            This is an alternative to the NAICS website hosted by the <a href="http://www.census.gov/eos/www/naics/index.html" target="_blank">US Census Bureau</a>. It uses <a href="http://naics.codeforamerica.org/" target="_blank">Code for America’s NAICS API</a> to provide a more user-friendly interface. The code is <a href="https://www.github.com/louh/naics-browser" target="_blank">open source</a>.
          </p>

          <p>
            For a sample NAICS code,
            {' '}<Link to={{ query: { year: 2012, code: '519120' } }}>
              take a look at this one.
            </Link>
          </p>

          <YearSelector year={this.state.year} selectYear={this.selectYear} />
        </div>
      )
    }
  }

  render () {
    return (
      <div role="main" className="viewport">
        <div className="left-column">
          <h1><Link to={{query: {}}}>NAICS Browser</Link></h1>
          <Search year={this.state.year} />
        </div>
        <div className="right-column">
          {this.renderRightColumn()}
        </div>
      </div>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.object
}

export default App;
