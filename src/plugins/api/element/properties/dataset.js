'use strict'

const utils = require( '@mojule/utils' )

const { camelCaseToHyphenated } = utils

const dataset = ({ api, state, core }) => {
  const Dataset = () => new Proxy( {}, {
    get: ( target, name ) => {
      name = 'data-' + camelCaseToHyphenated( name )

      return api.getAttribute( name )
    },
    set: ( target, name, value ) => {
      name = 'data-' + camelCaseToHyphenated( name )

      api.setAttribute( name, value )

      return true
    }
  })

  core.registerProperty({
    target: api,
    name: 'dataset',
    get: () => Dataset()
  })
}

module.exports = dataset
