'use strict'

const is = require( '@mojule/is' )

const attribute = ({ core }) => {
  const attributes = new Map()

  core.registerAttribute = ({
    name,
    isBoolean = false,
    isProperty = true,
    propertyName = () => name,
    rawProperty = false,
    parse = str => str,
    toString = value => value.toString(),
    nodeHas = node => true
  }) => {
    if( !is.string( name ) )
      throw Error( 'Expected name to be a string' )

    name = name.toLowerCase()

    if( attributes.has( name ) )
      throw Error(
        `attribute ${ name } is already registered`
      )

    attributes.set( name, {
      isBoolean, isProperty, propertyName, parse, toString, nodeHas
    })
  }

  core.attribute = name => {
    name = name.toLowerCase()

    return attributes.get( name )
  }

  core.addAttributeProperty = ({ target, name }) => {
    name = name.toLowerCase()

    const attribute = core.attribute( name )
    const state = core.getState( target )

    let get, set

    if( attribute.rawProperty ){
      get = () => state.value.attributes[ name ]
      set = value => state.value.attributes[ name ]
    } else {
      get = () => attribute.toString( state.value.attributes[ name ] )
      set = value => state.value.attributes[ name ] = attribute.parse( value )
    }

    core.registerProperty({ target, name: attribute.propertyName(), get, set })
  }

  core.registerProperty({
    target: core,
    name: 'attributeNames',
    get: () => Array.from( attributes.keys() )
  })
}

module.exports = attribute
