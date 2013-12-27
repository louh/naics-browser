(function () {
  'use strict';

  // NAICS VIEWER

  // Look for a query string indicating NAICS code.
  // If found, display it.
  // If not, display error.

  // If no query string, display an intro page w/ a link to random?

  var NAICS_API = 'http://naics.codeforamerica.org/v0/q?'

  // q?year=2012&code=519120

  var page = {

    naicsRequest: null,
    naicsRecord: null,

    init: function () {
      var request = this.naicsRequest
      request = this._getNAICSRequest()
      if (request.year && request.code) {
        this._getNAICSRecord(request.year, request.code)
      }
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
      }
      else {
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

        // Send to template display function
        page.displayNAICSRecord(this.naicsRecord)
      })
    },

    displayNAICSRecord: function (record) {
      $('#frontpage').hide()

      // Set document title
      document.title = record.code + ' ' + record.title + ' — ' + record.year + ' NAICS Viewer'

      console.log(record)

      var template = document.getElementById('template-record').innerHTML

      var snippet = _.template(template)
      document.getElementById('record').innerHTML = snippet(record)

    },

    displayError: function (jqxhr, status, error) {

      var error = document.getElementById('record')

//      var str = 'Error loading from NAICS API. Status: ' + status + '. Error: ' + error
      if (jqxhr.status == 404) {
        error.innerHTML = jqxhr.responseJSON.error_msg
      }
    }

  }

  $(document).ready(function() {
    
    page.init()
    
  })

}());
