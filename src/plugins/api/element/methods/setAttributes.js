'use strict'

const is = require( '@mojule/is' )

const setAttributes = ({ api, state, core }) => {
  // some other nodeTypes also have attributes? document?
  if( !api.isElementNode() ) return

  api.setAttributes = obj => {
    Object.keys( obj ).forEach( name => {
      const value = obj[ name ]

      api.setAttribute( name, value )
    })
  }
}

module.exports = setAttributes
