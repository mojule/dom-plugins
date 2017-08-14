'use strict'

const attributes = ({ api, state, core }) => {
  if( !api.isElementNode() ) return

  const { nodeList } = core

  core.registerProperty({
    target: api,
    name: 'attributes',
    get: () => nodeList( state.value.attributes ).map( ({ name, value }) => {
      const attribute = core.attribute( name )

      value = attribute.stringify( value )

      return { name, value }
    })
  })
}

module.exports = attributes
