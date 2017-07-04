'use strict'

const lastElementChild = ({ api, core }) => {
  if( !api.isElementNode() ) return

  core.registerProperty({
    target: api,
    name: 'lastElementChild',
    get: () => api.elementChildNodes.item( api.childElementCount )
  })
}

module.exports = lastElementChild
