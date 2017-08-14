'use strict'

const id = ({ api, core }) => {
  if( !api.isElementNode() ) return

  core.addAttributeProperty( api, 'id' )
}

module.exports = id