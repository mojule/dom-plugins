'use strict'

const innerHTML = ({ api, state, core, Api }) => {
  if( !api.isElementNode() ) return

  core.registerProperty({
    target: api,
    name: 'innerHTML',
    get: () => api.childNodes.reduce(
      ( html, current ) => html + current.toString(),
      ''
    ),
    set: str => {
      const node = Api.parse( str )

      api.removeAll()
      api.appendChild( node )
    }
  })
}

module.exports = innerHTML