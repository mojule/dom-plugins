'use strict'

const is = require( '@mojule/is' )
const utils = require( '@mojule/utils' )
const preserveWhitespace = require( './preserve-whitespace' )

const { escapeHtml } = utils

const defaultOptions = {
  indent: '  ',
  eol: '\n',
  pretty: false,
  depth: 0,
  wrapAt: 80,
  preserveWhitespace,
  normalizeWhitespace: true
}

const stringify = node => {
  return {
    stringify: ( options = {} ) => {
      options = Object.assign( {}, defaultOptions, options )

      const isPretty = options.pretty && is.function( node.isInline )

      const arr = []

      if( isPretty ){
        node.whitespace( options )
        addPretty( arr, node, options )
      } else {
        addNode( arr, node )
      }

      return arr.join( '' )
    }
  }
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

const addNode = ( arr, node ) => {
  const isElement = node.isElement()

  if( node.isText() ){
    arr.push( text( node ) )

    return
  }

  if( node.isComment() ){
    arr.push( comment( node ) )

    return
  }

  if( node.isDocumentType() ){
    arr.push( doctype( node ) )

    return
  }

  if( isElement ){
    arr.push( openTag( node ) )
  }

  node.getChildren().forEach( child => {
    addNode( arr, child )
  })

  if( isElement && !node.isEmpty() ){
    arr.push( closeTag( node ) )
  }
}

const addPretty = ( arr, node, options ) => {
  const { depth, indent, eol, wrapAt, preserveWhitespace } = options

  const isElement = node.isElement()
  const indentation = indent.repeat( depth )

  if( node.isText() ){
    arr.push( indentation + text( node ) + eol )

    return
  }

  if( node.isComment() ){
    arr.push( indentation + comment( node ) + eol )

    return
  }

  if( node.isDocumentType() ){
    arr.push( indentation + doctype( node ) + eol )

    return
  }

  if( !node.isElement() ){
    node.getChildren().forEach( child => {
      addPretty( arr, child, options )
    })

    return
  }

  if( preserveWhitespace.includes( node.tagName() ) ){
    arr.push( indentation + openTag( node ) )

    node.getChildren().forEach( child =>
      addNode( arr, child )
    )

    arr.push( closeTag( node ) + eol )

    return
  }

  const isAllInline = node.getChildren().every(
    child => child.isInline() || child.isText()
  )

  const childOptions = Object.assign( {}, options, { depth: depth + 1 } )

  if( !isAllInline ){
    arr.push( indentation + openTag( node ) + eol )

    node.getChildren().forEach( child =>
      addPretty( arr, child, childOptions )
    )

    arr.push( indentation + closeTag( node ) + eol )

    return
  }

  const open = openTag( node )
  const close = closeTag( node )

  const children = []

  node.getChildren().forEach( child => {
    addNode( children, child )
  })

  const childLength = children.reduce( ( sum, child ) => {
    return sum + child.length
  }, 0 )

  const length = indentation.length + open.length + childLength + close.length

  if( length <= wrapAt ){
    const el = indentation + open + children.join( '' ) + close + eol

    arr.push( el )

    return
  }

  arr.push( indentation + open + eol )
  pushWrapped( arr, children, childOptions )
  arr.push( indentation + close + eol )
}

const pushWrapped = ( arr, children, options ) => {
  const { depth, indent, eol, wrapAt } = options
  const indentation = indent.repeat( depth )
  const maxLength = wrapAt - indentation.length

  const segs = children.map( ( child, i ) => {
    // escape spaces within tags so they don't partake in wrapping
    if( child.startsWith( '<' ) )
      return child.replace( / /g, '\\U0020' )

    if( i === 0 )
      return child.replace( /^\s/g, '' )

    return child
  }).join( '' ).split( ' ' )

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

  result.push( line.join( ' ' ) )

  arr.push(
    result
      .map( line => indentation + line + eol )
      .join( '' )
      // replace previously escaped spaces within tags
      .replace( /\\U0020/g, ' ' )
  )
}

module.exports = stringify
