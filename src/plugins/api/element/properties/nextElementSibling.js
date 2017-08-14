'use strict'

const nextElementSibling = ({ api, core }) => {
  if( !api.isElementNode() ) return

  core.registerProperty({
    target: api,
    name: 'nextElementSibling',
    get: () => api.nextSiblingNodes.find( current => current.isElementNode() )
  })
}

module.exports = nextElementSibling
