'use strict'

const title = ({ api, core }) => {
  if( !api.isElementNode() ) return

  core.addAttributeProperty( api, 'title' )
}

module.exports = title