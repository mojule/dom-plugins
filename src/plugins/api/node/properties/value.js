'use strict'

const value = ({ api }) => {
  // value should only be accessed via properties
  delete api.value
}

module.exports = value