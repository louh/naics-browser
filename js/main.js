/* global $, Modernizr, _ */
(function () {
  'use strict'
  // NAICS BROWSER

  // Look for a query string indicating NAICS code.
  // If found, display it.
  // If not, display error.

  // If no query string, display an intro page w/ a link to random?

  var NAICS_API = 'http://naics.codeforamerica.org/v0/q?'
  var NAICS_SEARCH_API = 'http://naics.codeforamerica.org/v0/s?'

  // q?year=2012&code=519120

  var params = {
    year: 2012,
    code: null,
    terms: null,
    extra: null,
    twoDigit: null
  }

  function init () {
    // Force initial page load to have a triggered onpopstate
    if (Modernizr.history) {
      window.history.replaceState(null, null, document.URL)
    }

    // Set up search form
    $('#search-form').submit(function (e) {
      e.preventDefault()
      var terms = $('#search-input').val()
      var year = params.year
      getSearchResults(terms, year)
    })

    router()
  }

  function router () {
    if (!params) {
      params = getQueryStringParams()
    }

    if (params.year && params.code) {
      hideFrontPage()
      showLoading()
      getNAICSRecord(params.year, params.code)
    } else {
      reset()
    }
  }

  // Listen for history changes
  window.onpopstate = function (event) {
    // This event will fire on initial page load for Safari and old Chrome
    // So lack of state does not necessarily mean reset, depend on router here
    console.log(event)
    if (!event.state) {
      router()
      return
    } else {
      console.log(event.state)
      switch (event.state.page) {
        case 'about':
          // Do stuff
          break
        case 'latlng':
          // Do stuff
          break
        case 'address':
          // Do stuff
          break
        default:
          reset()
          break
      }
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
      return request
    }
  }

  function getNAICSRecord (year, code) {
    $.when(
      $.ajax({
        url: NAICS_API + 'year=' + year + '&code=' + code,
        async: true,
        dataType: 'json',
        success: function (response) {
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
        crossref.text = crossref.text.replace(/((U.S. )?Industry)|((Subs|S)ector)/g, '<a href="?year=' + params.year + '&code=' + crossref.code + '">$&')
      }
    }

    return record.crossrefs
  }

  function getSearchResults (terms, year) {
    var yr = year || '2012'
    $.ajax({
      url: NAICS_SEARCH_API + 'year=' + yr + '&terms=' + encodeURIComponent(terms),
      dataType: 'json',
      success: function (response) {
        displaySearchResults(response)
      },
      error: function (jqxhr, status, error) {
        displayError(jqxhr, status, error)
      }
    })
  }

  function displaySearchResults (response, year) {
    var yr = year || '2012'
    var $el = $('.search-results-list')
    response.sort(function (a, b) {
      return a.code > b.code
    })
    for (var i = 0, j = response.length; i < j; i++) {
      var item = response[i]
      var url = '?year=' + yr + '&code=' + item.code
      $el.append('<li><a href="' + url + '">' + item.code + ' &ndash; ' + item.title + '</a></li>')
    }

    // Attach event listeners
    if (Modernizr.history) {
      $('.search-results-list a').each(function (el) {
        $(this).on('click', function (event) {
          event.preventDefault()
          window.history.pushState(params, null, url)
        })
      })
    }
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

  function showLoading () {
    document.getElementById('loading').style.display = 'block'
  }

  function hideLoading () {
    document.getElementById('loading').style.display = 'none'
  }

  function showFrontPage () {
    document.getElementById('frontpage').style.display = 'block'
  }

  function hideFrontPage () {
    document.getElementById('frontpage').style.display = 'none'
  }

  function reset () {
    hideLoading()
    showFrontPage()
  }

  // --------------------
  //  INITIALIZE
  // --------------------

  $(document).ready(function () {
    init()
  })
}())
