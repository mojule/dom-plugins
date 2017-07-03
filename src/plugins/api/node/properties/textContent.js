'use strict'

const is = require( '@mojule/is' )

const textContent = ({ api, core, Api }) => {
  core.registerProperty({
    target: api,
    name: 'textContent',
    get: () => {
      if( api.isDocumentNode() || api.isDocumentTypeNode() )
        return null

      if( api.isCommentNode() || api.isTextNode() )
        return api.nodeValue

      // ?
      if( api.isProcessingInstructionNode() )
        return api.data

      return api.dfsNodes.reduce( ( text, current ) => {
        if( api.isTextNode() )
          text += current.nodeValue

        return text
      }, '' )
    },
    set: value => {
      if( api.isTextNode() || api.isCommentNode() ){
        api.nodeValue = value
      } else if( api.isProcessingInstructionNode() ){
        // ?
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
