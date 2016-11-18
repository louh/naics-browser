// Polyfills
import 'whatwg-fetch'

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
