'use strict'

const nodeName = ({ api, state, core }) => {
  const { nodeName } = api

  core.registerProperty({
    target: api,
    name: 'nodeName',
    get: () => {
      if( api.isElementNode() )
        return api.tagName

      if( api.isDocumentTypeNode() )
        return state.value.qualifiedNameStr

      return nodeName
    }
  })
}

module.exports = nodeName
