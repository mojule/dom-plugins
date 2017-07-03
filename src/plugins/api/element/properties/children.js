'use strict'

const children = ({ api, core }) => {
  if( !api.isElementNode() ) return

  core.registerProperty({
    target: api,
    name: 'children',
    get: () => api.childNodes.filter( current => current.isElementNode() )
  })
}

module.exports = children
