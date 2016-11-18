import { isEqual } from 'lodash'
import React from 'react'
import RecordView from './RecordView'
import { getTwoDigitCode } from './record-helpers'

const NAICS_API = 'http://naics.codeforamerica.org/v0/q?'
const LOADING_TIME_DELAY = 200

class Record extends React.Component {
  constructor () {
    super()

    this.state = {
      isLoading: true,
      message: null
    }

    this.getNAICSRecord = this.getNAICSRecord.bind(this)
    this.displayError = this.displayError.bind(this)
  }

  componentDidMount () {
    const { year, code } = this.props

    this.getNAICSRecord(code, year)
  }

  componentWillReceiveProps (nextProps) {
    if (!isEqual(this.props, nextProps)) {
      this.getNAICSRecord(nextProps.code, nextProps.year)
    }
  }

  getNAICSRecord (code, year) {
    window.fetch(`${NAICS_API}year=${year}&code=${code}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status)
        }

        return response.json()
      })
      .then(record => {
        // Check if part of range
        if (record.part_of_range) {
          this.getNAICSRecord(record.part_of_range, year)
          return
        }

        // params.twoDigit = getTwoDigitCode(response.code)
        this.setNAICSRecord(record)
      })
      .catch(error => {
        this.displayError(error)
      })
  }

  setNAICSRecord (record) {
    // Add stuff from props
    record.year = this.props.year
    record.twoDigit = getTwoDigitCode(this.props.code)

    // Clean up
    this.setState({
      record,
      isLoading: false
    })
  }

  displayError (error) {
    console.log(error)
    this.setState({
      message: error,
      isLoading: false
    })
  }

  render () {
    if (this.state.isLoading) {
      // TODO: Is there a LOADING_TIME_DELAY before this is displayed?
      return (
        <div className="loading">
          <div className="loading-spinner"></div>
          <div className="loading-message">Retrieving...</div>
        </div>
      )
    } else if (this.state.record) {
      return <RecordView record={this.state.record} />
    } else if (this.state.message) {
      return <div>{this.state.message}</div>
    }

    return (<div>Unknown error happened.</div>)
  }
}

Record.propTypes = {
  year: React.PropTypes.number.isRequired,
  code: React.PropTypes.string.isRequired
}

export default Record
