'use strict'

const is = require( '@mojule/is' )

const getAttributes = ({ api, state }) => {
  // some other nodeTypes also have attributes? document?
  if( !api.isElementNode() ) return

  api.getAttributes = () => state.value.attributes
}

module.exports = getAttributes
