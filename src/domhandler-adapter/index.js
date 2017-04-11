'use strict'

const DomHandler = ( nodeApi, options ) => {
  const state = State( nodeApi, options )

  const handler = { state }

  const api = Api( handler )

  return api
}

//default options
const defaultOpts = {
  normalizeWhitespace: false
}

const whitespace = /\s+/g

const State = ( nodeApi, options ) => {
  options = options || defaultOpts

  const fragment = nodeApi.createDocumentFragment()
  const done = false
  const tagStack = []
  const parser = null

  const state = {
    options, fragment, done, tagStack, parser, nodeApi
  }

  return state
}

const Api = handler => {
  const { options, nodeApi, tagStack, fragment } = handler.state

  const oninit = parser => handler.state.parser = parser

  const onreset = () => handler.state = State( nodeApi, options )

  const onend = () => {
    if( handler.state.done ) return

    handler.state.done = true
    handler.state.parser = null

    onerror( null )
  }

  const onerror = err => {
    if( err ) throw err
  }

  const onclosetag = () => tagStack.pop()

  const onopentag = ( name, attribs ) => {
    const element = nodeApi.createElement( name, attribs )

    addDomNode( handler, element )

    tagStack.push( element )
  }

  const ontext = data => {
    const normalize = options.normalizeWhitespace || options.ignoreWhitespace ?
      str => str.replace( whitespace, ' ' ) :
      str => str

    const previousText = findPreviousText( handler )

    if( previousText ) {
      const nodeValue = previousText.nodeValue()

      previousText.nodeValue( normalize( nodeValue + data ) )
    } else {
      data = normalize( data )

      const text = nodeApi.createText( data )

      addDomNode( handler, text )
    }
  }

  const oncomment = data => {
    const lastTag = tagStack[ tagStack.length - 1 ]

    if( lastTag && lastTag.isComment() ) {
      const value = lastTag.nodeValue()

      lastTag.nodeValue( value + data )

      return
    }

    const comment = nodeApi.createComment( data )

    addDomNode( handler, comment )
    tagStack.push( comment )
  }

  const onprocessinginstruction = ( name, data ) => {
    oncomment( data )
    oncommentend()
  }

  const oncommentend = () => handler.state.tagStack.pop()

  const getDom = () => handler.state.fragment

  const api = {
    oninit, onreset, onend, onerror, onclosetag, onopentag, ontext, oncomment,
    oncommentend, onprocessinginstruction, getDom
  }

  return api
}

const findPreviousText = handler => {
  const { tagStack, fragment } = handler.state

  if( tagStack.length ) {
    const lastTag = tagStack[ tagStack.length - 1 ]
    const children = lastTag.getChildren()

    if( children.length ) {
      const lastChild = children[ children.length - 1 ]

      if( lastChild.isText() ) return lastChild
    }
  }

  const children = fragment.getChildren()

  if( !children || !children.length ) return

  const lastChild = children[ children.length - 1 ]

  if( lastChild.isText() ) return lastChild
}

const addDomNode = ( handler, node ) => {
  const { tagStack, fragment } = handler.state

  const parent = tagStack[ tagStack.length - 1 ]
  const target = parent || fragment

  try {
    target.append( node )
  } catch( e ){
    console.error( target.get() )
    console.error( node.get() )
    throw e
  }
}

module.exports = DomHandler
