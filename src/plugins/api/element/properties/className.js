'use strict'

const className = ({ api, core }) => {
  if( !api.isElementNode() ) return

  core.addAttributeProperty( api, 'class' )
}

module.exports = className