'use strict'

const utils = require( '@mojule/utils' )

const { escapeHtml } = utils

const stringify = node => {
  const stringify = () => {
    let ml = ''

    const nodeType = node.nodeType()

    if( node.isText() )
      ml += escapeHtml( node.nodeValue() )

    if( node.isComment() )
      ml += `<!--${ node.nodeValue() }-->`

    if( node.isElement() ){
      ml += `<${ node.tagName() }`

      const attributes = node.getAttributes()

      Object.keys( attributes ).forEach( name => {
        const value = attributes[ name ]

        ml += ` ${ name }`

        if( value )
          ml += `="${ value }"`
      })

      ml += node.isEmpty() ? ' />' : '>'
    }

    if( node.isDocumentType() ){
      const { name, publicId, systemId } = node.getValue()

      ml += `<!doctype ${ name }`

      if( publicId ){
        ml += ` public "${ publicId }"`
      }

      if( systemId ){
        ml += ` "${ systemId }"`
      }

      ml += '>'
    }

    node.getChildren().forEach( child =>
      ml += child.stringify()
    )

    if( node.isElement() && !node.isEmpty() ){
      ml += `</${ node.tagName() }>`
    }

    return ml
  }

  return { stringify }
}

module.exports = stringify
