'use strict'

const name = ({ api, core }) => {
  if( !api.isElementNode() ) return

  core.addAttributeProperty( api, 'name' )
}

module.exports = name