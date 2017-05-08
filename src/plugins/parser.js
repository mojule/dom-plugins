'use strict'

const htmlparser2 = require( 'htmlparser2' )
const DomHandler = require( '../domhandler-adapter' )
const preserveWhitespace = require( './preserve-whitespace' )

const defaultOptions = {
  /*
    otherwise self closing tags don't work - htmlparser2 whitelists them in
    normal mode
  */
  xmlMode: true,
  removeWhitespace: false,
  trimText: false,
  normalizeWhitespace: false,
  ignoreWhitespace: false,
  preserveWhitespace
}

const parser = node => {
  return {
    $parse: ( str, options = {} ) => {
      options = Object.assign( {}, defaultOptions, options )

      const handler = DomHandler( node, options )

      // look at the API on this thing 😂
      new htmlparser2.Parser( handler, options ).end( str )

      const dom = handler.getDom()

      dom.whitespace( options )

      const isSingleElement =
        dom.isDocumentFragment() && dom.getChildren().length === 1

      if( isSingleElement )
        return dom.firstChild().clone()

      return dom
    }
  }
}

module.exports = parser
