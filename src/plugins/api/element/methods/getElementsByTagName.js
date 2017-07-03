'use strict'

const is = require( '@mojule/is' )

const getElementsByTagName = ({ api, state, core }) => {
  if( !api.isElementNode() ) return

  api.getElementsByTagName = tagName => {
    if( !is.string( tagName ) )
      throw Error( 'getElementsByTagName expected a string' )

    tagName = tagName.toLowerCase()

    if( tagName === '*' )
      return api.descendantNodes.filter( current => current.isElementNode() )

    // should ensure it's live
    return api.descendantNodes.filter( current =>
      current.isElementNode() && current.matches( tagName )
    )
  }
}

module.exports = getElementsByTagName
