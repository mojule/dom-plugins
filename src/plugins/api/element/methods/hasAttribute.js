'use strict'

const is = require( '@mojule/is' )

const hasAttribute = ({ api, state, core }) => {
  // some other nodeTypes also have attributes? document?
  if( !api.isElementNode() ) return

  api.hasAttribute = name => {
    name = name.toLowerCase()

    return !is.undefined( state.value.attributes[ name ] )
  }
}

module.exports = hasAttribute
