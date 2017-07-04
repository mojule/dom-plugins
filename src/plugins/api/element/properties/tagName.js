'use strict'

const tagName = ({ api, state, core }) => {
  if( !api.isElementNode() ) return

  core.registerProperty({
    target: api,
    name: 'tagName',
    get: () => state.value.tagName
  })
}

module.exports = tagName
