'use strict'

const previousElementSibling = ({ api, core }) => {
  if( !api.isElementNode() ) return

  core.registerProperty({
    target: api,
    name: 'previousElementSibling',
    get: () => api.previousSiblingNodes.find( current => current.isElementNode() )
  })
}

module.exports = previousElementSibling
