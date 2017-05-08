'use strict'

const preserveWhitespace = require( './preserve-whitespace' )

const defaultOptions = {
  removeWhitespace: false,
  ignoreWhitespace: false,
  normalizeWhitespace: false,
  preserveWhitespace
}

const whitespaceTest = /\s+/g

const whitespace = node => {
  return {
    collapseText: () => {
      node.walk( current => {
        if( !current.isText() ) return

        const previous = current.previousSibling()

        if( !previous ) return
        if( !previous.isText() ) return

        const thisText = current.nodeValue()
        const previousText = previous.nodeValue()

        previous.nodeValue( previousText + thisText )
        current.remove()
      })
    },
    whitespace: ( options ) => {
      node.collapseText()

      options = Object.assign( {}, defaultOptions, options )

      const {
        preserveWhitespace, removeWhitespace, normalizeWhitespace,
        ignoreWhitespace
      } = options

      const isHandleWhitespace = (
        removeWhitespace || normalizeWhitespace || ignoreWhitespace
      )

      if( isHandleWhitespace ){
        const next = current => {
          const tagName = current.tagName()
          if( preserveWhitespace.includes( tagName ) ) return

          if( current.isText() ){
            if( removeWhitespace && current.nodeValue().trim() === '' ){
              current.remove()

              return
            }

            if( normalizeWhitespace || ignoreWhitespace ){
              const text = current.nodeValue().replace( whitespaceTest, ' ' )

              current.nodeValue( text )
            }
          } else {
            current.getChildren().forEach( next )
          }
        }

        next( node )
      }
    }
  }
}

module.exports = whitespace
