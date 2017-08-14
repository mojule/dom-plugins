'use strict'

const html = require( '@mojule/html' )

const registerElements = ({ core }) => {
  const tagNames = html.tagNames()

  tagNames.forEach( tagName => {
    core.registerElement({
      tagName,
      isEmpty: html.isEmpty( tagName ),
      accepts: ( parent, child ) => html.accepts( tagName, child.nodeName )
    })
  })
}

const isInlineNode = ({ api }) => {
  api.isInlineNode = () => html.isInlineNode( api.nodeName )
}

module.exports = {
  api: isInlineNode,
  core: registerElements
}
