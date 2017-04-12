'use strict'

const is = require( '@mojule/is' )
const flatten = require( '@mojule/flatten' )

const { expand } = flatten

const valueTypes = [ 'number', 'boolean', 'null', 'string' ]

const convert = {
  number: str => parseFloat( str ),
  boolean: str => str === 'true',
  null: str => null,
  string: str => str
}

const attributes = node => {
  return {
    getAttributes: () => {
      const attributes = node.getValue( 'attributes' )

      if( !is.undefined( attributes ) ){
        if( is.object( attributes ) )
          return attributes

        throw new Error(
          'If attributes is present in node value it should be an object'
        )
      }

      return {}
    },
    setAttributes: attr => {
      if( !is.object( attr ) )
        throw new Error( 'Attributes must be an object' )

      const attributes = node.getAttributes()

      Object.keys( attr ).forEach( name => {
        const value = attr[ name ]

        node.setAttr( name, value )
      })

      node.setValue( 'attributes', attributes )

      return attributes
    },
    attributes: attr => {
      if( !is.undefined( attr ) )
        return node.setAttributes( attr )

      return node.getAttributes()
    },
    getAttr: name => node.getAttributes()[ name ],
    setAttr: ( name, value ) => {
      const attributes = node.getAttributes()

      attributes[ name ] = value.toString()

      node.setValue( 'attributes', attributes )

      return value
    },
    attr: ( name, value ) => {
      if( !is.undefined( value ) )
        return node.setAttr( name, value )

      return node.getAttr( name )
    },
    hasAttr: name => !is.undefined( node.getAttr( name ) ),
    removeAttr: name => {
      const attributes = node.getAttributes()
      const value = attributes[ name ]

      delete attributes[ name ]

      node.setValue( 'attributes', attributes )

      return value
    },
    clearAttrs: () => node.setValue( 'attributes', {} ),
    $valueToAttributes: value => {
      value = flatten( value )

      return Object.keys( value ).reduce( ( attrs, key ) => {
        let newKey = key
          .replace( /\./g, '_' )
          .replace( /\[(\d+)\]/g, '-$1' )

        const valueType = is.of( value[ key ] )

        if( valueType !== 'string' )
          newKey += `-${ valueType }`

        attrs[ newKey ] = value[ key ] === null ? 
          'null' : value[ key ].toString()

        return attrs
      }, {} )
    },
    $attributesToValue: attr  => {
      if( !is.object( attr ) )
        throw new Error( 'Attributes must be an object' )

      attr = Object.keys( attr ).reduce( ( value, key ) => {
        let attrValue = attr[ key ]

        const valueType = valueTypes.find( t => key.endsWith( `-${ t }` ) )

        if( valueType ){
          const index = key.lastIndexOf( `-${ valueType }` )
          key = key.substr( 0, index )
          attrValue = convert[ valueType ]( attrValue )
        }

        const newKey = key
          .replace( /-(\d+)/g, '[$1]' )
          .replace( /_/g, '.' )

        value[ newKey ] = attrValue

        return value
      }, {} )

      const value = expand( attr )

      return value
    }
  }
}

module.exports = attributes
