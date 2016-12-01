/*
  A wrapper for react-router's <Link> component so that query string urls
  are appended to, not replaced. For instance, if you linked to a `code=` but
  did not also pass `year=` to react-router's <Link to={}>, it would remove
  `year=` from the url.

  This means that any component that needs to create a link needs all
  url parameters passed to it as props. The difference here is that we will
  remember url query string components so that they are replaced, old ones
  will continue to exist.

  Also allows a simplified way to write the <Link to={{ query: {} }}> syntax
  required by react-router, by using <Link query={obj}>.
*/
import React from 'react'
import { Link as WrappedLink } from 'react-router'

function currentSearchParamsToObject () {
  const params = new window.URLSearchParams(window.location.search)
  const object = {}

  for (let param of params) {
    const key = param[0]
    const value = param[1]

    object[key] = value
  }

  return object
}

export function Link (props) {
  const { to, query, ...rest } = props
  const currentParams = currentSearchParamsToObject()
  const queryObject = Object.assign({}, currentParams, query || to.query)

  // TODO: delete keys from the object.

  return (
    <WrappedLink to={{ query: queryObject }} {...rest}>
      {rest.children}
    </WrappedLink>
  )
}

Link.propTypes = {
  query: React.PropTypes.object
}
