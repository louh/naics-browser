/*
  A wrapper for react-router's <Link> component so that query string urls
  are appended to, not replaced. For instance, if you linked to a `code=` but
  did not also pass `year=` to <Link to={}>, it would remove `year=` from the
  url. This means that any component that needs to create a link needs all
  url parameters passed to it as props. The difference here is that we will
  remember url query string components so that they are replaced, old ones
  will continue to exist.

  Also this simplifies the <Link to={{ query: {} }}> syntax required by
  react-router.

  Experimental. Not done. TODO: how to set initial state of this?
*/
import React from 'react'
import { Link } from 'react-router'

let queryStringObject = {}

function LinkWrapper (props) {
  queryStringObject = Object.assign({}, queryStringObject, props.query)

  // TODO: delete keys from the object.

  return ({
    <Link to={{ query: queryStringObject }}>
      {this.props.children}
    </Link>
  })
}

LinkWrapper.propTypes = {
  query: React.PropTypes.object
}

export default LinkWrapper
