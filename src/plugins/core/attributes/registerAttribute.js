'use strict'

const is = require( '@mojule/is' )

const attribute = ({ core }) => {
  const attributes = new Map()

  const Attribute = ({
    name,
    isBoolean = false,
    isProperty = true,
    propertyName = () => name,
    rawProperty = false,
    parse = str => str,
    stringify = value => value.toString(),
    nodeHas = node => true
  }) => {
    if( !is.string( name ) )
      throw Error( 'Expected name to be a string' )

    name = name.toLowerCase()

    return {
      name, isBoolean, isProperty, propertyName, parse, stringify, nodeHas
    }
  }

  core.registerAttribute = ( data ) => {
    const attribute = Attribute( data )
    const { name } = attribute

    if( attributes.has( name ) )
      throw Error(
        `Attribute ${ name } is already registered`
      )

    attributes.set( name, attribute )
  }

  core.attribute = name => {
    name = name.toLowerCase()

    if( attributes.has( name ) )
      return attributes.get( name )

    return Attribute({ name })
  }

  core.addAttributeProperty = ( target, name ) => {
    name = name.toLowerCase()

    const attribute = core.attribute( name )

    let get, set

    if( attribute.rawProperty ){
      get = () => target.value.attributes[ name ]
      set = value => target.value.attributes[ name ]
    } else {
      get = () => attribute.stringify(
        target.value.attributes ? target.value.attributes[ name ] : ''
      )
      set = value => {
        if( is.undefined( target.value.attributes ) )
          target.value.attributes = {}

        target.value.attributes[ name ] = attribute.parse( value )

        return target.value.attributes[ name ]
      }
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
