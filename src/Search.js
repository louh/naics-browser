import React from 'react'

class Search extends React.Component {
  constructor () {
    super()

    this.state = {
      searchInput: '',
      searchResults: [],
      isSearching: false
    }

    this.onChangeSearchInput = this.onChangeSearchInput.bind(this)
    this.onSubmitSearch = this.onSubmitSearch.bind(this)
  }

  onChangeSearchInput (event) {
    const searchInput = event.target.value
    this.setState({ searchInput })
  }

  onSubmitSearch (event) {
    event.preventDefault()
  }

  render () {
    return (
      <div>
        <div className="search-box">
          <form
            id="search-form"
            value={this.state.searchInput}
            onSubmit={this.onSubmitSearch}
            onChange={this.onChangeSearchInput}
          >
            <input id="search-input" type="text" placeholder="search" />
          </form>
        </div>

        <div className="search-loading" id="search-loading">
          <div className="loading-spinner"></div>
          <div className="loading-message">Searching...</div>
        </div>

        <div className="search-results">
          <ul className="search-results-list"></ul>
        </div>
      </div>
    )
  }
}

export default Search
