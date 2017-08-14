'use strict'

const is = require( '@mojule/is' )

const getElementsByClassName = ({ api, state, core }) => {
  if( !api.isElementNode() ) return

  api.getElementsByClassName = className => {
    if( !is.string( className ) )
      throw Error( 'getElementsByClassName expected a string' )

    const selector = (
      className
        .split( ' ' ).filter( s => s !== '' ).map( name => '.' + name )
        .join( '' )
    )

    // should ensure it's live
    return api.descendantNodes.filter( current =>
      current.isElementNode() && current.matches( selector )
    )
  }
}

module.exports = getElementsByClassName
