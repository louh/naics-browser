/* global $, Modernizr, _ */
(function () {
  'use strict'
  // NAICS BROWSER

  // Look for a query string indicating NAICS code.
  // If found, display it.
  // If not, display error.

  // If no query string, display an intro page w/ a link to random?

  var NAICS_API = 'http://naics.codeforamerica.org/v0/q?'
  var DEFAULT_YEAR = '2012'
  var LOADING_TIME_DELAY = 200

  var params

  function init () {
    // Force initial page load to have a triggered onpopstate
    if (Modernizr.history) {
      window.history.replaceState(null, null, document.URL)
    }

    router()
  }

  function router () {
    if (typeof params !== 'object') {
      params = getQueryStringParams()
    }

    var routed = false
    var year = params.year || DEFAULT_YEAR

    if (params.code) {
      loadRecord(params.code, DEFAULT_YEAR)
      routed = true
    }

    if (params.terms) {
      getSearchResults(params.terms, DEFAULT_YEAR)
      routed = true
    }

    if (!routed) {
      reset()
    }
  }

  // Listen for history changes
  // TODO: Is this working?
  window.onpopstate = function (event) {
    console.log(event)
    // This event will fire on initial page load for Safari and old Chrome
    // So lack of state does not necessarily mean reset, depend on router here
    if (!event.state) {
      router()
      return
    } else {
      console.log(event.state)
    }
  }

  // --------------------
  //  UTILITIES
  // --------------------

  // Get query string parameters as object
  function getQueryStringParams () {
    var request = {}
    if (window.location.search.length > 0) {
      var queries = window.location.search.substring(1).split('&')
      for (var i in queries) {
        var query = queries[i]
        var keyValue = query.split('=')
        request[keyValue[0]] = keyValue[1]
      }
    }
    return request
  }

  function makeHTTPQueryString () {
    // Turns params into query string
    var string = '?'
    var paramStrings = []

    // global params
    if (params.year) {
      paramStrings.push('year=' + params.year)
    }
    if (params.code) {
      paramStrings.push('code=' + params.code)
    }
    if (params.terms) {
      paramStrings.push('terms=' + encodeURIComponent(params.terms))
    }

    return string + paramStrings.join('&')
  }

  function addParam (key, value) {
    // Add to global params object
    params[key] = value

    // Add to URL string
    var queryString = makeHTTPQueryString()

    // Push state to history
    if (Modernizr.history) {
      window.history.pushState(params, null, window.location.href.split('?')[0] + queryString)
    }
  }

  function loadRecord (code, year) {
    clearView()
    showLoading()
    getNAICSRecord(code, year)
  }

  // --------------------
  //  UI
  // --------------------
  function clearView () {
    document.getElementById('view').innerHTML = ''
    hideLoading()
    hideFrontPage()
  }

  function reset () {
    clearView()
    clearSearch()
    showFrontPage()
  }

  // --------------------
  //  INITIALIZE
  // --------------------

  $(document).ready(function () {
    init()

    // Attach event listeners
    if (Modernizr.history) {
      $('body').on('click', '.naics-link', function (e) {
        e.preventDefault()
        var anchor = $(this)
        var newParams = {
          year: anchor.data('year'),
          code: anchor.data('code')
        }
        window.history.pushState(newParams, null, this.href)
        loadRecord(newParams.code, newParams.year)
      })
    }
  })
}())
