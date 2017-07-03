'use strict'

const childElementCount = ({ api, core }) => {
  if( !api.isElementNode() ) return

  core.registerProperty({
    target: api,
    name: 'childElementCount',
    get: () => api.childNodes.filter( current => current.isElementNode() ).length
  })
}

module.exports = childElementCount
