'use strict'

const htmlparser2 = require( 'htmlparser2' )
const DomHandler = require( '../../../domhandler-adapter' )
const preserveWhitespace = require( '../../preserve-whitespace' )

const defaultOptions = {
  /*
    otherwise self closing tags don't work - htmlparser2 whitelists them in
    normal mode
  */
  xmlMode: true,
  removeWhitespace: false,
  normalizeWhitespace: false,
  ignoreWhitespace: false,
  preserveWhitespace
}

const parse = ({ statics }) => {
  statics.parse = ( str, options = {} ) => {
    options = Object.assign( {}, defaultOptions, options )

    const handler = DomHandler( statics, options )

    // look at the API on this thing 😂
    new htmlparser2.Parser( handler, options ).end( str )

    const dom = handler.getDom()

    dom.whitespace( options )

    if( dom.isDocumentFragmentNode() && dom.childNodes.length === 1 )
      return dom.firstChild.remove()

    return dom
  }
}

module.exports = parse
