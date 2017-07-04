'use strict'

const firstElementChild = ({ api, core }) => {
  if( !api.isElementNode() ) return

  core.registerProperty({
    target: api,
    name: 'firstElementChild',
    get: () => api.elementChildNodes.item( 0 )
  })
}

module.exports = firstElementChild
