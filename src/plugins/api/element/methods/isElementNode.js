'use strict'

/*
  override the default because anything that's not blacklisted should be treated
  as an element node
*/
const isElementNode = ({ api, Api }) => {
  const blacklist = [
    Api.TEXT_NODE, Api.COMMENT_NODE, Api.DOCUMENT_FRAGMENT_NODE,
    Api.DOCUMENT_NODE, Api.DOCUMENT_TYPE_NODE, Api.PROCESSING_INSTRUCTION_NODE
  ]

  api.isElementNode = () => !blacklist.includes( api.nodeType )
}

module.exports = isElementNode
