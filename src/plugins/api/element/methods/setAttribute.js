'use strict'

const is = require( '@mojule/is' )

const setAttribute = ({ api, state, core }) => {
  // some other nodeTypes also have attributes? document?
  if( !api.isElementNode() ) return

  api.setAttribute = ( name, value ) => {
    if( !is.string( name ) )
      throw Error( 'setAttribute expected a string' )

    name = name.toLowerCase()

    const attribute = core.attribute( name )

    state.value.attributes[ name ] = attribute.parse( value )
  }
}

module.exports = setAttribute
