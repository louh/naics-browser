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

  function getNAICSRecord (code, year) {
    $.when(
      $.ajax({
        url: NAICS_API + 'year=' + year + '&code=' + code,
        async: true,
        dataType: 'json',
        success: function (response) {
          // Check if part of range
          if (response.part_of_range) {
            getNAICSRecord(response.part_of_range, year)
            return
          }

          params.twoDigit = getTwoDigitCode(response.code)
          displayNAICSRecord(response)
        },
        error: function (jqxhr, status, error) {
          displayError(jqxhr, status, error)
        }
      })
    )
  }

  function getTwoDigitCode (code) {
    var twoDigitCode
    var twoDigitTitle
    var twoDigitCodeRaw = parseInt(code.toString().substring(0, 2), 10)

    // Hard coded right now because I'm too lazy to engineer it
    if (twoDigitCodeRaw >= 92) {
      twoDigitCode = '92'
      twoDigitTitle = 'Public Administration'
    } else if (twoDigitCodeRaw >= 81) {
      twoDigitCode = '81'
      twoDigitTitle = 'Other Services (except Public Administration)'
    } else if (twoDigitCodeRaw >= 72) {
      twoDigitCode = '72'
      twoDigitTitle = 'Accommodation and Food Services'
    } else if (twoDigitCodeRaw >= 71) {
      twoDigitCode = '71'
      twoDigitTitle = 'Arts, Entertainment, and Recreation'
    } else if (twoDigitCodeRaw >= 62) {
      twoDigitCode = '62'
      twoDigitTitle = 'Health Care and Social Assistance'
    } else if (twoDigitCodeRaw >= 61) {
      twoDigitCode = '61'
      twoDigitTitle = 'Educational Services'
    } else if (twoDigitCodeRaw >= 56) {
      twoDigitCode = '56'
      twoDigitTitle = 'Administrative and Support and Waste Management and Remediation Services'
    } else if (twoDigitCodeRaw >= 55) {
      twoDigitCode = '55'
      twoDigitTitle = 'Management of Companies and Enterprises'
    } else if (twoDigitCodeRaw >= 54) {
      twoDigitCode = '54'
      twoDigitTitle = 'Professional, Scientific, and Technical Services'
    } else if (twoDigitCodeRaw >= 53) {
      twoDigitCode = '53'
      twoDigitTitle = 'Real Estate and Rental and Leasing'
    } else if (twoDigitCodeRaw >= 52) {
      twoDigitCode = '52'
      twoDigitTitle = 'Finance and Insurance'
    } else if (twoDigitCodeRaw >= 51) {
      twoDigitCode = '51'
      twoDigitTitle = 'Information'
    } else if (twoDigitCodeRaw >= 48) {
      twoDigitCode = '48-49'
      twoDigitTitle = 'Transportation and Warehousing'
    } else if (twoDigitCodeRaw >= 44) {
      twoDigitCode = '44-45'
      twoDigitTitle = 'Retail Trade'
    } else if (twoDigitCodeRaw >= 42) {
      twoDigitCode = '42'
      twoDigitTitle = 'Wholesale Trade'
    } else if (twoDigitCodeRaw >= 31) {
      twoDigitCode = '31-33'
      twoDigitTitle = 'Manufacturing'
    } else if (twoDigitCodeRaw >= 23) {
      twoDigitCode = '23'
      twoDigitTitle = 'Construction'
    } else if (twoDigitCodeRaw >= 22) {
      twoDigitCode = '22'
      twoDigitTitle = 'Utilities'
    } else if (twoDigitCodeRaw >= 21) {
      twoDigitCode = '21'
      twoDigitTitle = 'Mining, Quarrying, and Oil and Gas Extraction'
    } else if (twoDigitCodeRaw >= 11) {
      twoDigitCode = '11'
      twoDigitTitle = 'Agriculture, Forestry, Fishing and Hunting'
    }

    return {
      code: twoDigitCode,
      title: twoDigitTitle
    }
  }

  function displayNAICSRecord (record) {
    // Set document title
    document.title = params.code + ' ' + record.title + ' – ' + params.year + ' NAICS Browser'

    // Parse record and insert HTML
    if (record.crossrefs) {
      record.crossrefs = parseCrossrefs(record)
    }

    // Make 'The Sector as a Whole' on top-level NAICS into a subtitle
    if (record.code.toString().length === 2) {
      if (record.description[0] === 'The Sector as a Whole') {
        record.description[0] = '<h3>The Sector as a Whole</h3>'
      }
    }

    // Add stuff from params (TODO)
    record.year = params.year
    record.twoDigit = params.twoDigit
    console.log(record)

    var template = document.getElementById('template-record').innerHTML
    var snippet = _.template(template)

    document.getElementById('view').innerHTML = snippet(record)

    // Clean up
    hideLoading()
  }

  function displayError (jqxhr, status, error) {
    var message = document.getElementById('message')

    if (jqxhr.status === 404) {
      message.className += 'error'
      message.innerHTML = jqxhr.responseJSON.error_msg
    }

    hideLoading()
  }

  // Parsing descriptions
  // Numerical links to Sectors and Subsectors may exist.
  function parseCrossrefs (record) {
    if (!record.crossrefs) {
      return
    }

    for (var i = 0, j = record.crossrefs.length; i < j; i++) {
      var crossref = record.crossrefs[i]

      // Replace dashes
      crossref.text = crossref.text.replace('--', '&mdash;')

      // Add links
      /*
          Notes:
          Preceding the code # may be words like 'Industry', 'Industry Group', 'U.S. Industry', 'Subsector', or 'Sector'
          After the code # is the title, terminated by a semicolon or period.
          Use this to figure out the actual length of the link text.
      */
      var x = crossref.text.indexOf(crossref.code)
      if (x > 0) {
        var codeRegexp = new RegExp(crossref.code + '.+(?=[.;])', 'g')
        crossref.text = crossref.text.replace(codeRegexp, '$&</a>')
        crossref.text = crossref.text.replace(/((U.S. )?Industry)|((Subs|S)ector)/g, '<a href="?year=' + params.year + '&code=' + crossref.code + '" class="naics-link" data-year="' + params.year +'" data-code="' + crossref.code + '">$&')
      }
    }

    return record.crossrefs
  }

  var naicsSelectorEl = document.querySelector('.js-naics-year-select')
  var naicsSelectorPills = naicsSelectorEl.querySelectorAll('.pill')
  for (var i = 0, j = naicsSelectorPills.length; i < j; i++) {
    var pill = naicsSelectorPills[i]
    pill.addEventListener('click', pillSelected, false)
  }

  function pillSelected (event) {
    for (var i = 0, j = naicsSelectorPills.length; i < j; i++) {
      var pill = naicsSelectorPills[i]
      pill.classList.remove('pill-selected')
    }
    event.target.classList.add('pill-selected')
  }

  // --------------------
  //  UI
  // --------------------

  var loadingTimer

  function showLoading () {
    loadingTimer = setTimeout(function () {
      document.getElementById('loading').style.display = 'block'
    }, LOADING_TIME_DELAY)
  }

  function hideLoading () {
    clearTimeout(loadingTimer)
    document.getElementById('loading').style.display = 'none'
  }

  function showFrontPage () {
    document.getElementById('frontpage').style.display = 'block'
  }

  function hideFrontPage () {
    document.getElementById('frontpage').style.display = 'none'
  }

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
