'use strict'

const is = require( '@mojule/is' )
const flatten = require( '@mojule/flatten' )

const { expand } = flatten

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
    valueToAttributes: () => {
      const value = flatten( node.getValue() )

      return Object.keys( value ).reduce( ( attrs, key ) => {
        if( key === 'nodeType' )
          return attrs

        const newKey = key
          .replace( /\./g, '__' )
          .replace( /\[/g, '$_' )
          .replace( /\]/g, '_$' )

        attrs[ newKey ] = value[ key ].toString()

        return attrs
      }, {} )
    },
    // nb - lossy - every attribute value will be a string
    // should probably allow a 2nd optional schema arg
    attributesToValue: attr  => {
      if( !is.object( attr ) )
        throw new Error( 'Attributes must be an object' )

      attr = Object.keys( attr ).reduce( ( value, key ) => {
        const newKey = key
          .replace( /__/g, '.' )
          .replace( /\$_/g, '[' )
          .replace( /_\$/g, ']' )

        value[ newKey ] = attr[ key ]

        return value
      }, {} )

      const value = expand( attr )

      return node.assign( value )
    }
  }
}

module.exports = attributes
