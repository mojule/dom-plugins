'use strict'

const is = require( '@mojule/is' )

const textContent = ({ api, privates, Api }) => {
  privates.registerProperty({
    target: api,
    name: 'textContent',
    get: () => {
      if( api.isDocument() || api.isDocumentType() )
        return null

      if( api.isComment() || api.isProcessingInstruction() || api.isText() )
        return api.nodeValue

      return api.dfsNodes.reduce( ( text, current ) => {
        if( api.isText() )
          text += current.nodeValue

        return text
      }, '' )
    },
    set: value => {
      if( api.isText() || api.isComment() || api.isProcessingInstruction() ){
        api.nodeValue = value
      } else {
        const textNode = Api.createTextNode( value )

        api.removeAll()
        api.appendChild( textNode )
      }

      return value
    }
  })
}

module.exports = textContent
