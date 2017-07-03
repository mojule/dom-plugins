'use strict'

const is = require( '@mojule/is' )

const removeAttribute = ({ api, state, core }) => {
  // some other nodeTypes also have attributes? document?
  if( !api.isElementNode() ) return

  api.removeAttribute = name => {
    if( !is.string( name ) )
      throw Error( 'removeAttribute expected a string' )

    name = name.toLowerCase()

    delete state.value.attributes[ name ]
  }
}

module.exports = removeAttribute
