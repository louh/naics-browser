import React from 'react'
import './YearSelector.css'

class YearSelector extends React.Component {
  constructor () {
    super()

    this.years = [2007, 2012]
  }

  renderPills () {
    return this.years.map(year => {
      let className = 'pill'
      if (year === this.props.year) {
        className += ' pill-selected'
      }

      return (
        <li className={className} key={year} onClick={(e) => { this.props.selectYear(year)}}>
          {year}
        </li>
      )
    })
  }

  render () {
    return (
      <ul className="pills">
        {this.renderPills()}
      </ul>
    )
  }
}

YearSelector.propTypes = {
  year: React.PropTypes.number.isRequired,
  selectYear: React.PropTypes.func.isRequired
}

export default YearSelector
