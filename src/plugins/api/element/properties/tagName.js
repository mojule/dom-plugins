'use strict'

const tagName = ({ api, state, core }) => {
  if( !api.isElementNode() ) return

  core.addProperty({
    target: api,
    name: tagName,
    get: () => state.value.tagName
  })
}

module.exports = tagName
