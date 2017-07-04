'use strict'

const outerHTML = ({ api, state, core, Api }) => {
  if( !api.isElementNode() ) return

  core.registerProperty({
    target: api,
    name: 'outerHTML',
    get: () => api.toString(),
    set: str => {
      if( !api.parentNode )
        throw Error( 'Cannot set outerHTML on root' )

      const current = core.getApi( state )
      const node = Api.parse( str )

      api.parentNode.replaceChild( current, node )
    }
  })
}

module.exports = outerHTML