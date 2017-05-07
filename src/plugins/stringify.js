'use strict'

const is = require( '@mojule/is' )
const utils = require( '@mojule/utils' )

const { escapeHtml } = utils

const defaultOptions = {
  indent: '  ',
  pretty: false,
  depth: 0,
  wrapAt: 80
}

const text = node => escapeHtml( node.nodeValue() )

const comment = node => `<!--${ node.nodeValue() }-->`

const doctype = node => {
  let ml = ''

  const { name, publicId, systemId } = node.getValue()

  ml += `<!doctype ${ name }`

  if( publicId ){
    ml += ` public "${ publicId }"`
  }

  if( systemId ){
    ml += ` "${ systemId }"`
  }

  ml += '>'

  return ml
}

const openTag = node => {
  let ml = `<${ node.tagName() }`

  const attributes = node.getAttributes()

  Object.keys( attributes ).forEach( name => {
    const value = attributes[ name ]

    ml += ` ${ name }`

    if( value )
      ml += `="${ value }"`
  })

  ml += node.isEmpty() ? ' />' : '>'

  return ml
}

const closeTag = node => node.isEmpty() ? '' : `</${ node.tagName() }>`

const wrap = ( str, maxLength, indentation ) => {
  maxLength = maxLength - indentation

  const segs = str.split( ' ' )
  const result = []
  let line = []
  let length = 0

  segs.forEach( seg => {
    if( ( length + seg.length ) >= maxLength ){
      result.push( line.join( ' ' ) )
      line = []
      length = 0
    }

    length += seg.length + 1
    line.push( seg )
  })

  if( line.length > 0 ){
    result.push( line.join( ' ' ) )
  }

  return result.map( line => indentation + line + '\n' ).join( '' )
}

const stringify = node => {
  const stringify = ( options = {} ) => {
    options = Object.assign( {}, defaultOptions, options )

    const { indent, wrapAt } = options
    let { pretty, depth } = options

    pretty = pretty && is.function( node.isInline )

    const hasChildren = node.hasChildren()
    const isElement = node.isElement()
    let indentation = ''
    let eol = ''
    let openTagEol = ''
    let closeTagIndentation = ''
    let isAllInline = false

    if( pretty ){
      isAllInline = node.getChildren().every(
        child => child.isInline() || child.isText()
      )
      const isTagIndented = hasChildren && !isAllInline

      indentation = pretty ? indent.repeat( depth ) : ''
      eol = pretty ? '\n' : ''
      openTagEol = isTagIndented ? eol : ''
      closeTagIndentation = isTagIndented ? indentation : ''
    }

    let ml = ''

    if( node.isText() ){
      ml += indentation + text( node ) + eol

      return ml
    }

    if( node.isComment() ){
      ml += indentation + comment( node ) + eol

      return ml
    }

    if( node.isDocumentType() ){
      ml += indentation + doctype( node ) + eol

      return ml
    }

    let length = 0
    let close = ''

    if( isElement ){
      const open = indentation + openTag( node ) + openTagEol
      ml += open
      length += open.length

      close = closeTagIndentation + closeTag( node ) + eol

      length += close.length
    }

    if( hasChildren ){
      const children = node.getChildren()

      let childMls = ''
      let childrenLength = 0

      children.forEach( ( child, i ) => {
        let options = {}

        if( pretty ){
          const isFirst = i === 0
          const isLast = i === children.length - 1
          const childDepth = isElement ? depth + 1 : depth
          const isPretty = !isAllInline

          options = { indent, pretty: isPretty, depth: childDepth }
        }

        const childMl = child.stringify( options )

        childrenLength += childMl.length

        childMls += childMl
      })

      if( pretty && isAllInline && ( length + childrenLength ) > wrapAt ){
        ml += eol

        const childIndentation = indent.repeat( depth + 1 )

        childMls = wrap( childMls, wrapAt, childIndentation )

        ml += childMls

        ml += indentation
      } else {
        ml += childMls
      }
    }

    ml += close

    return ml
  }

  return { stringify }
}

module.exports = stringify
