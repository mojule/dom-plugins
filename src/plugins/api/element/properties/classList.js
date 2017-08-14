'use strict'

const is = require( '@mojule/is' )

const ClassList = api => {
  const regExp = name => RegExp( `(^| )${ name }( |$)` )

  const contains = name => regExp( name ).test( api.className )

  const add = ( ...names ) => {
    names.forEach( name => {
      if( contains( name ) ) return

      if( api.className.length > 0 )
        api.className += ' '

      api.className += name
    })
  }

  const remove = ( ...names ) => {
    names.forEach( name => {
      api.className = api.className.replace( regExp( name ), '' )
    })
  }

  const replace = ( oldName, newName ) => {
    remove( oldName )
    add( newName )
  }

  const toggle = ( name, force ) => {
    if( is.undefined( force ) ){
      if( contains( name ) ){
        remove( name )
      } else {
        add( name )
      }
    } else {
      if( force ){
        add( name )
      } else {
        remove( name )
      }
    }
  }

  return { add, contains, remove, toggle, replace }
}

const classList = ({ api, core }) => {
  if( !api.isElementNode() ) return

  core.registerProperty({
    target: api,
    name: 'classList',
    get: () => ClassList( api )
  })
}

module.exports = classList
