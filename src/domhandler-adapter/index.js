'use strict'

const DomHandler = ( NodeApi, options ) => {
  const state = State( NodeApi, options )

  const handler = { state }

  const api = Api( handler )

  return api
}

//default options
const defaultOpts = {
  normalizeWhitespace: false
}

const State = ( NodeApi, options ) => {
  options = Object.assign( {}, defaultOpts, options )

  const fragment = NodeApi.createDocumentFragment()
  const done = false
  const tagStack = []
  const parser = null

  const state = {
    options, fragment, done, tagStack, parser, NodeApi
  }

  return state
}

const Api = handler => {
  const { options, NodeApi, tagStack, fragment } = handler.state

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
    const element = NodeApi.createElement( name, attribs )

    addDomNode( handler, element )

    tagStack.push( element )
  }

  const ontext = data => {
    const text = NodeApi.createText( data )

    addDomNode( handler, text )
  }

  const oncomment = data => {
    const comment = NodeApi.createComment( data )

    addDomNode( handler, comment )
    tagStack.push( comment )
  }

  const onprocessinginstruction = ( name, data ) => {
    /* only support html5 doctype, look into parsing the data string properly */
    if( data.toLowerCase().startsWith( '!doctype' ) ){
      const doctype = NodeApi.createDocumentType( 'html' )

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

  target.appendChild( node )
}

module.exports = DomHandler
