'use strict'

const is = require( '@mojule/is' )
const H = require( 'html-script' )
const Adapter = require( '../../../html-script-adapter' )

const h = ({ statics, core, Api }) => {
  const { tagNames } = core
  const nodeNames = Object.keys( core.nodeTypes )
    .filter( name => name !== 'element' ).map( name => '#' + name )

  const options = {
    nodeNames: tagNames.concat( nodeNames )
  }

  core.registerProperty({
    target: statics,
    name: 'h',
    get: () => {
      const adapter = Adapter( Api )

      return H( adapter, options )
    }
  })
}

module.exports = h
