'use strict'

const childElementCount = ({ api, core }) => {
  if( !api.isElementNode() ) return

  core.registerProperty({
    target: api,
    name: 'childElementCount',
    get: () => api.elementChildNodes.length
  })
}

module.exports = childElementCount
