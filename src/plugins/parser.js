'use strict'

const htmlparser2 = require( 'htmlparser2' )
const DomHandler = require( '../domhandler-adapter' )

const defaultOptions = {
  /*
    otherwise self closing tags don't work - htmlparser2 whitelists them in
    normal mode
  */
  xmlMode: true,
  removeWhitespace: false,
  trimText: false
}

const parser = node => {
  return {
    $parse: ( str, options = {} ) => {
      options = Object.assign( {}, defaultOptions, options )

      const handler = DomHandler( node, options )

      // look at the API on this thing 😂
      new htmlparser2.Parser( handler, options ).end( str )

      const dom = handler.getDom()

      if( options.removeWhitespace )
        dom.prune( current =>
          current.isText() && current.nodeValue().trim() === ''
        )

      if( options.trimText )
        dom.walk( current => {
          if( !current.isText() ) return

          const text = current.nodeValue()

          current.nodeValue( text.trim() )
        })

      const isSingleElement =
        dom.isDocumentFragment() && dom.getChildren().length === 1

      if( isSingleElement )
        return dom.firstChild().clone()

      return dom
    }
  }
}

module.exports = parser
