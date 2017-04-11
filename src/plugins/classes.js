'use strict'

const is = require( '@mojule/is' )

const ensureName = name => {
  if( !is.string( name ) || name.trim() === '' )
    throw new Error( 'Class name should be a non-empty string' )
}

const classes = node => {
  return {
    classNames: () => {
      const classAttr = node.getAttr( 'class' )

      if( is.string( classAttr ) )
        return classAttr.split( ' ' ).map( s =>
          s.trim()
        ).filter( s => s !== '' )

      return []
    },
    addClass: name => {
      ensureName( name )

      const classNames = node.classNames()

      classNames.push( name.trim() )

      node.setAttr( 'class', classNames.join( ' ' ) )

      return node
    },
    hasClass: name => node.classNames().includes( name ),
    addClasses: ( ...names ) => {
      if( names.length === 1 && is.array( names[ 0 ] ) )
        names = names[ 0 ]

      names.forEach( node.addClass )

      return node
    },
    removeClass: name => {
      ensureName( name )

      const classNames = node.classNames().filter( n => n !== name.trim() )

      node.setAttr( 'class', classNames.join( ' ' ) )

      return node
    },
    toggleClass: ( name, shouldHave ) => {
      ensureName( name )

      name = name.trim()

      const alreadyHas = node.hasClass( name )

      if( is.undefined( shouldHave ) )
        return node.toggleClass( name, !alreadyHas )

      if( alreadyHas ){
        if( shouldHave )
          return node

        return node.removeClass( name )
      }

      if( shouldHave )
        return node.addClass( name )

      return node
    },
    clearClasses: () => {
      node.setAttr( 'class', '' )

      return node
    }
  }
}

module.exports = classes
