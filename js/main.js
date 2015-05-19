(function () {
  'use strict';

  // NAICS VIEWER

  // Look for a query string indicating NAICS code.
  // If found, display it.
  // If not, display error.

  // If no query string, display an intro page w/ a link to random?

  var NAICS_API = 'http://naics.codeforamerica.org/v0/q?'
  var NAICS_SEARCH_API = 'http://naics.codeforamerica.org/v0/s?' //year=2012&terms=Interne'

  // q?year=2012&code=519120

  var page = {
    naicsRequest: null,
    naicsRecord: null,

    init: function () {
      var request = this.naicsRequest
      request = this._getNAICSRequest()
      if (request.year && request.code) {
        document.getElementById('loading').style.display = 'block'
        this._getNAICSRecord(request.year, request.code)
      } else {
        document.getElementById('frontpage').style.display = 'block'
      }

      $('#search-form').submit(function (e) {
        e.preventDefault()
        var terms = $('#search-input').val()
        getSearchResults(terms)
      })
    },

    _getNAICSRequest: function () {
      var request = {}
      if (window.location.search.length > 0) {
        var queries = window.location.search.substring(1).split('&')

        for (var i in queries) {
          var query = queries[i]
          var keyValue = query.split('=')
          request[keyValue[0]] = keyValue[1]
        }
        return request
      } else {
        request['errorCode'] = '100'
        request['errorMsg']  = 'No NAICS request specified'
        return request
      }
    },

    _getNAICSRecord: function (year, code) {
      $.when(
        $.ajax({
          url: NAICS_API + 'year=' + year + '&code=' + code,
          async: true,
          dataType: 'json',
          success: function (response) {
            this.naicsRecord = response
          },
          error: function (jqxhr, status, error) {
            page.displayError(jqxhr, status, error)
          }
        })
      ).then(function() {
        // Add additional information
        this.naicsRecord.year = year
        this.naicsRecord.twoDigit = page._getTwoDigitCode(this.naicsRecord.code)

        // Send to template display function
        page.displayNAICSRecord(this.naicsRecord)
      })
    },

    _getTwoDigitCode: function (code) {
      var twoDigitCode
      var twoDigitTitle
      var twoDigitCodeRaw = parseInt(code.toString().substring(0,2))

      // Hard coded right now because I'm too lazy to engineer it
      if (twoDigitCodeRaw >= 92) {
        twoDigitCode = '92'
        twoDigitTitle = 'Public Administration'
      }
      else if (twoDigitCodeRaw >= 81) {
        twoDigitCode = '81'
        twoDigitTitle = 'Other Services (except Public Administration)'
      }
      else if (twoDigitCodeRaw >= 72) {
        twoDigitCode = '72'
        twoDigitTitle = 'Accommodation and Food Services'
      }
      else if (twoDigitCodeRaw >= 71) {
        twoDigitCode = '71'
        twoDigitTitle = 'Arts, Entertainment, and Recreation'
      }
      else if (twoDigitCodeRaw >= 62) {
        twoDigitCode = '62'
        twoDigitTitle = 'Health Care and Social Assistance'
      }
      else if (twoDigitCodeRaw >= 61) {
        twoDigitCode = '61'
        twoDigitTitle = 'Educational Services'
      }
      else if (twoDigitCodeRaw >= 56) {
        twoDigitCode = '56'
        twoDigitTitle = 'Administrative and Support and Waste Management and Remediation Services'
      }
      else if (twoDigitCodeRaw >= 55) {
        twoDigitCode = '55'
        twoDigitTitle = 'Management of Companies and Enterprises'
      }
      else if (twoDigitCodeRaw >= 54) {
        twoDigitCode = '54'
        twoDigitTitle = 'Professional, Scientific, and Technical Services'
      }
      else if (twoDigitCodeRaw >= 53) {
        twoDigitCode = '53'
        twoDigitTitle = 'Real Estate and Rental and Leasing'
      }
      else if (twoDigitCodeRaw >= 52) {
        twoDigitCode = '52'
        twoDigitTitle = 'Finance and Insurance'
      }
      else if (twoDigitCodeRaw >= 51) {
        twoDigitCode = '51'
        twoDigitTitle = 'Information'
      }
      else if (twoDigitCodeRaw >= 48) {
        twoDigitCode = '48-49'
        twoDigitTitle = 'Transportation and Warehousing'
      }
      else if (twoDigitCodeRaw >= 44) {
        twoDigitCode = '44-45'
        twoDigitTitle = 'Retail Trade'
      }
      else if (twoDigitCodeRaw >= 42) {
        twoDigitCode = '42'
        twoDigitTitle = 'Wholesale Trade'
      }
      else if (twoDigitCodeRaw >= 31) {
        twoDigitCode = '31-33'
        twoDigitTitle = 'Manufacturing'
      }
      else if (twoDigitCodeRaw >= 23) {
        twoDigitCode = '23'
        twoDigitTitle = 'Construction'
      }
      else if (twoDigitCodeRaw >= 22) {
        twoDigitCode = '22'
        twoDigitTitle = 'Utilities'
      }
      else if (twoDigitCodeRaw >= 21) {
        twoDigitCode = '21'
        twoDigitTitle = 'Mining, Quarrying, and Oil and Gas Extraction'
      }
      else if (twoDigitCodeRaw >= 11) {
        twoDigitCode = '11'
        twoDigitTitle = 'Agriculture, Forestry, Fishing and Hunting'
      }

      return {
        code: twoDigitCode,
        title: twoDigitTitle
      }
    },

    displayNAICSRecord: function (record) {
      $('#frontpage').hide()

      // Set document title
      document.title = record.code + ' ' + record.title + ' – ' + record.year + ' NAICS Viewer'

      // Parse record and insert HTML
      if (record.crossrefs) {
        record.crossrefs = this._parseCrossrefs(record)
      }

      // Make 'The Sector as a Whole' on top-level NAICS into a subtitle
      if (record.code.toString().length === 2) {
        if (record.description[0] === 'The Sector as a Whole') {
          record.description[0] = '<h3>The Sector as a Whole</h3>'
        }
      }

      console.log(record)

      var template = document.getElementById('template-record').innerHTML
      var snippet = _.template(template)

      document.getElementById('view').innerHTML = snippet(record)
      $('#loading').hide()
    },

    displayError: function (jqxhr, status, error) {
      var message = document.getElementById('message')

      if (jqxhr.status == 404) {
        message.className += 'error'
        message.innerHTML = jqxhr.responseJSON.error_msg
      }

      $('#loading').hide()
    },

    // Parsing descriptions
    // Numerical links to Sectors and Subsectors may exist.

    _parseCrossrefs: function (record) {
      if (!record.crossrefs) {
        return
      }

      for (var i = 0; i < record.crossrefs.length; i ++) {
        var crossref = record.crossrefs[i]

        // Replace dashes
        crossref.text = crossref.text.replace('--','&mdash;')

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
          crossref.text = crossref.text.replace(/((U.S. )?Industry)|((Subs|S)ector)/g, '<a href="?year=' + record.year + '&code=' + crossref.code + '">$&')
        }
      }

      return record.crossrefs
    }

  }

  $(document).ready(function() {
    page.init()
  })

  function getSearchResults (terms, year) {
    var yr = year || '2012'
    $.ajax({
      url: NAICS_SEARCH_API + 'year=' + yr + '&terms=' + encodeURIComponent(terms),
      dataType: 'json',
      success: function (response) {
        displaySearchResults(response)
      },
      error: function (jqxhr, status, error) {
        page.displayError(jqxhr, status, error)
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
      $el.append('<li><a href="?year=' + yr + '&code=' + item.code + '">' + item.code + ' &ndash; ' + item.title + '</a></li>')
    }
  }

  var naicsSelectorEl = document.querySelector('.js-naics-year-select')
  var naicsSelectorPills = naicsSelectorEl.querySelectorAll('.pill')
  for (var i = 0, j = naicsSelectorPills.length; i < j; i++) {
    var pill = naicsSelectorPills[i]
    pill.addEventListener('click', _pillSelected, false)
  }
  function _pillSelected (event) {
    for (var i = 0, j = naicsSelectorPills.length; i < j; i++) {
      var pill = naicsSelectorPills[i]
      pill.classList.remove('pill-selected')
    }
    event.target.classList.add('pill-selected')
  }

}())
