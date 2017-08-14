'use strict'

const nodeName = ({ api, state, core, Api }) => {
  const { nodeName } = api

  core.registerProperty({
    target: api,
    name: 'nodeName',
    get: () => {
      if( api.nodeType === Api.ELEMENT_NODE )
        return api.tagName

      if( api.nodeType === Api.DOCUMENT_TYPE_NODE )
        return state.value.name

      return nodeName
    }
  })
}

module.exports = nodeName
