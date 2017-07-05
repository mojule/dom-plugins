'use strict'

const isInlineNode = ({ api, Api }) => {
  api.isInlineNode = () =>
    api.isTextNode() || api.isCommentNode() || api.isProcessingInstructionNode()
}

module.exports = isInlineNode
