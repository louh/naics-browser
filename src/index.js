// Polyfills
import 'whatwg-fetch'

// ES6 import does not work
// import { URLSearchParams } from 'url-search-params'
// Import via a 'require', then put it globally if not present.
var URLSearchParams = require('url-search-params')
if (!window.URLSearchParams) {
  window.URLSearchParams = URLSearchParams
}

// React and React utilities
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Match } from 'react-router'

// Application
import App from './App'
import './index.css'

const RouteLocation = ({ location }) => (
  <App location={location} />
)

const Root = () => {
  return (
    <BrowserRouter>
      <div>
        <Match pattern="/" component={RouteLocation} />
      </div>
    </BrowserRouter>
  )
}

ReactDOM.render(
  <Root />,
  document.getElementById('root')
)
