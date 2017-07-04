'use strict'

function* entries( obj ) {
  for( let key of Object.keys( obj ) )
    yield [ key, obj[ key ] ]
}

const attributes = ({ api, state, core }) => {
  if( !api.isElementNode() ) return

  const { nodeList } = core

  core.registerProperty({
    target: api,
    name: 'attributes',
    get: () => nodeList( entries( state.value.attributes ) ).map( pair => {
      const name = pair[ 0 ]
      const attribute = core.attribute( name )
      const value = attribute.stringify( pair[ 1 ] )

      return { name, value }
    })
  })
}

module.exports = attributes
