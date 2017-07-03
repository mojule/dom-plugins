'use strict'

const is = require( '@mojule/is' )

const getAttribute = ({ api, state, core }) => {
  // some other nodeTypes also have attributes? document?
  if( !api.isElementNode() ) return

  api.getAttribute = name => {
    if( !is.string( name ) )
      throw Error( 'getAttribute expected a string' )

    name = name.toLowerCase()

    if( !api.hasAttribute( name ) ) return null

    const value = state.value.attributes[ name ]
    const attribute = core.attribute( name )

    return attribute.toString( value )
  }
}

module.exports = getAttribute
