'use strict'

const is = require( '@mojule/is' )

const hasAttributes = ({ api, state, core }) => {
  // some other nodeTypes also have attributes? document?
  if( !api.isElementNode() ) return

  api.hasAttributes = () => Object.keys( state.value.attributes ).length > 0
}

module.exports = hasAttributes
