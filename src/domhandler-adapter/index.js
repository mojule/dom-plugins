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
  options = Object.assign( {}, defaultOpts, options )

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

  const onend = () => {
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
    if( options.normalizeWhitespace || options.ignoreWhitespace )
      data = data.replace( whitespace, ' ' )

    const text = nodeApi.createText( data )

    addDomNode( handler, text )
  }

  const oncomment = data => {
    const comment = nodeApi.createComment( data )

    addDomNode( handler, comment )
    tagStack.push( comment )
  }

  const onprocessinginstruction = ( name, data ) => {
    /* only support html5 doctype, look into parsing the data string properly */
    if( data.toLowerCase().startsWith( '!doctype' ) ){
      const doctype = nodeApi.createDocumentType( 'html' )

      addDomNode( handler, doctype )

      return
    }

    oncomment( data )
    oncommentend()
  }

  const oncommentend = () => handler.state.tagStack.pop()

  const getDom = () => handler.state.fragment

  const api = {
    onend, onerror, onclosetag, onopentag, ontext, oncomment,
    oncommentend, onprocessinginstruction, getDom
  }

  return api
}

const addDomNode = ( handler, node ) => {
  const { tagStack, fragment } = handler.state

  const parent = tagStack[ tagStack.length - 1 ]
  const target = parent || fragment

  target.append( node )
}

module.exports = DomHandler
