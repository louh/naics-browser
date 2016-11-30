import React from 'react'
import { Link } from './Link'
import './Search.css'

const NAICS_SEARCH_API = 'http://naics.codeforamerica.org/v0/s?'

class Search extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      searchInput: '',
      searchResults: [],
      searchRequested: false,
      lastSearchTerms: null,
      isSearching: false,
      error: null
    }

    this.getSearchResults = this.getSearchResults.bind(this)
    this.renderSearchResults = this.renderSearchResults.bind(this)
    this.onChangeSearchInput = this.onChangeSearchInput.bind(this)
    this.onSubmitSearch = this.onSubmitSearch.bind(this)
  }

  componentDidMount () {
    if (this.props.terms) {
      this.setState({
        searchInput: this.props.terms
      })
      this.doSearch()
    } else {
      this.input.focus()
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.terms !== prevProps.terms) {
      this.doSearch()
    }
  }

  getSearchResults (terms, year) {
    this.clearSearch()
    this.setState({
      searchRequested: true,
      lastSearchTerms: terms,
      isSearching: true
    })
    this.props.setSearchTerms(terms)

    window.fetch(`${NAICS_SEARCH_API}year=${year}&terms=${window.encodeURIComponent(terms)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status)
        }

        return response.json()
      })
      .then(results => {
        results.sort(function (a, b) {
          const prop = 'seq_no'
          return (a[prop] < b[prop]) ? -1 : 1
        })

        this.setState({
          searchResults: results,
          isSearching: false
        })
      })
      .catch(error => {
        console.log(error)
        this.setState({
          error: error
        })
      })
  }

  displayNoSearchResults (terms) {
    this.setState({
      lastSearchTerms: terms,
      searchRequested: true
    })
  }

  clearSearch () {
    this.setState({
      searchResults: [],
      searchRequested: false,
      isSearching: false
    })
  }

  doSearch () {
    const terms = this.props.terms
    const year = this.props.year

    if (!terms) {
      this.clearSearch()
      this.displayNoSearchResults(terms)
      return
    }

    this.getSearchResults(terms, year)
  }

  onChangeSearchInput (event) {
    const searchInput = event.target.value
    this.setState({ searchInput })
  }

  onSubmitSearch (event) {
    event.preventDefault()
    const terms = this.state.searchInput.trim()
    this.props.setSearchTerms(terms)
  }

  renderSearchResults () {
    const results = this.state.searchResults

    return results.map(result => {
      const query = {
        year: this.props.year,
        code: result.code,
        terms: this.state.lastSearchTerms
      }

      return (
        <li key={result.code}>
          <Link query={query}>
            {result.code} &ndash; {result.title}
          </Link>
        </li>
      )
    })
  }

  render () {
    let results

    if (this.state.isSearching) {
      results = (
        <div className="search-loading">
          <div className="loading-spinner"></div>
          <div className="loading-message">Searching...</div>
        </div>
      )
    } else if (this.state.searchRequested) {
      if (this.state.searchResults.length > 0) {
        results = (
          <div className="search-results">
            <ul className="search-results-list">{this.renderSearchResults()}</ul>
          </div>
        )
      } else {
        if (this.state.lastSearchTerms) {
          results = (
            <div className="search-message">
              No results found for <strong>{this.state.lastSearchTerms}</strong>.
            </div>
          )
        } else {
          results = (
            <div className="search-message">
              No search terms were provided.
            </div>
          )
        }
      }
    }

    return (
      <div>
        <div className="search-box">
          <form
            id="search-form"
            value={this.state.searchInput}
            onSubmit={this.onSubmitSearch}
            onChange={this.onChangeSearchInput}
          >
            <input
              id="search-input"
              type="text"
              placeholder="search"
              ref={(ref) => { this.input = ref }}
            />
          </form>
        </div>

        {results}
      </div>
    )
  }
}

Search.propTypes = {
  year: React.PropTypes.number.isRequired,
  terms: React.PropTypes.string,
  setSearchTerms: React.PropTypes.func
}

export default Search
