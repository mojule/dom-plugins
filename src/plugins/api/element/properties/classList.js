'use strict'

const classList = ({ api, state, core }) => {
  if( !api.isElementNode() ) return

  const { nodeList } = core

  core.registerProperty({
    target: api,
    name: 'classList',
    get: () => nodeList( state.value.attributes.class )
  })
}

module.exports = classList
