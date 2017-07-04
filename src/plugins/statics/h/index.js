'use strict'

const is = require( '@mojule/is' )
const H = require( 'html-script' )
const Adapter = require( '../../../html-script-adapter' )

const nonTags = [
  '#text', '#comment', '#document', '#document-type', '#document-fragment'
]

const h = ({ statics, core, Api }) => {
  const { tagNames } = core
  const nodeNames = Object.keys( core.nodeTypes ).map( name => '#' + name )

  const options = {
    nodeNames: tagNames.concat( nodeNames )
  }

  const adapter = Adapter( Api )
  const h = H( adapter, options )

  core.registerProperty({
    target: statics,
    name: 'h',
    get: () => h
  })
}

module.exports = h
