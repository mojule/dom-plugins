'use strict'

const normalize = ({ api }) => {
  api.normalize = () => {
    api.dfsNodes.forEach( current => {
      if( !current.isText() ) return

      if( current.nodeValue === '' ){
        current.remove()
        return
      }

      if( current.previousSibling.isText() ){
        current.previousSibling.nodeValue += current.nodeValue
        current.remove()
      }
    })
  }
}