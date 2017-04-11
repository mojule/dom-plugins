'use strict'

const is = require( '@mojule/is' )
const utils = require( '@mojule/utils' )

const { camelCaseToHyphenated, hyphenatedToCamelCase } = utils

const dataset = node => {
  return {
    getDataset: () => {
      const attributes = node.getAttributes()

      if( is.empty( attributes ) )
        return attributes

      const attributeKeys = Object.keys( attributes )
      const dataKeys = attributeKeys.filter( key => key.startsWith( 'data-' ) )

      const dataset = dataKeys.reduce( ( set, dataKey ) => {
        const prefixRemoved = dataKey.slice( 'data-'.length )
        const camelCased = hyphenatedToCamelCase( prefixRemoved )

        set[ camelCased ] = attributes[ dataKey ].toString()

        return set
      }, {} )

      return dataset
    },
    // lossy - see comment in attributes
    setDataset: dataset => {
      if( !is.object( dataset ) )
        throw new Error( 'Expected dataset to be an object' )

      Object.keys( dataset ).forEach( key => {
        const dataKey = 'data-' + camelCaseToHyphenated( key )
        const value = dataset[ key ].toString()

        node.setAttr( dataKey, value )
      })

      return dataset
    },
    dataset: dataset => {
      if( !is.undefined( dataset ) )
        return node.setDataset( dataset )

      return node.getDataset( dataset )
    }
  }
}

module.exports = dataset
