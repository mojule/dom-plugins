'use strict'

const preserveWhitespace = require( '../../../preserve-whitespace' )

const defaultOptions = {
  removeWhitespace: false,
  ignoreWhitespace: false,
  normalizeWhitespace: false,
  preserveWhitespace
}

const whitespaceTest = /\s+/g

const whitespace = ({ api }) => {
  api.whitespace = options => {
    api.normalize()

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
        const { tagName } = current

        if( preserveWhitespace.includes( tagName ) ) return

        if( current.isTextNode() ){
          if( removeWhitespace && current.nodeValue.trim() === '' ){
            current.remove()

            return
          }

          if( normalizeWhitespace || ignoreWhitespace ){
            current.nodeValue = current.nodeValue.replace( whitespaceTest, ' ' )
          }
        } else {
          current.childNodes.forEach( next )
        }
      }

      next( api )
    }
  }
}

module.exports = whitespace
