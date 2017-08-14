'use strict'

const utils = require( '@mojule/utils' )

const { clone: jsonClone } = utils

const cloneNode = ({ api, state, Api }) => {
  api.cloneNode = ( deep = false,  mapper = value => jsonClone( value ) ) => {
    if( !deep ){
      const { value } = state
      const mapped = mapper( value )

      return Api( mapped )
    }

    return api.clone( mapper )
  }
}

module.exports = cloneNode
