'use strict'

const nodeValue = ({ api, state, core, Api }) => {
  if( ![ Api.TEXT_NODE, Api.COMMENT_NODE ].includes( api.nodeType ) ) return

  core.registerProperty({
    target: api,
    name: 'nodeValue',
    get: () => state.value.nodeValue,
    set: value => state.value.nodeValue = value
  })
}

module.exports = nodeValue
