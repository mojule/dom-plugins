'use strict'

const normalize = ({ api }) => {
  api.normalize = () => {
    api.dfsNodes.forEach( current => {
      if( !current.isTextNode() ) return

      if( current.nodeValue === '' ){
        current.remove()
        return
      }

      if( current.previousSibling && current.previousSibling.isTextNode() ){
        current.previousSibling.nodeValue += current.nodeValue
        current.remove()
      }
    })
  }
}

module.exports = normalize
