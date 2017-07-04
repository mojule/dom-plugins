'use strict'

const closest = require( './element/methods/closest' )
const getAttribute = require( './element/methods/getAttribute' )
const getAttributes = require( './element/methods/getAttributes' )
const getElementsByClassName = require( './element/methods/getElementsByClassName' )
const getElementsByTagName = require( './element/methods/getElementsByTagName' )
const hasAttribute = require( './element/methods/hasAttribute' )
const hasAttributes = require( './element/methods/hasAttributes' )
const matches = require( './element/methods/matches' )
const querySelector = require( './element/methods/querySelector' )
const querySelectorAll = require( './element/methods/querySelectorAll' )
const removeAttribute = require( './element/methods/removeAttribute' )
const select = require( './element/methods/select' )
const selectAll = require( './element/methods/selectAll' )
const setAttribute = require( './element/methods/setAttribute' )
const setAttributes = require( './element/methods/setAttributes' )

const attributes = require( './element/properties/attributes' )
const childElementCount = require( './element/properties/childElementCount' )
const children = require( './element/properties/children' )
const classList = require( './element/properties/classList' )
const className = require( './element/properties/className' )
const dataset = require( './element/properties/dataset' )
const firstElementChild = require( './element/properties/firstElementChild' )
const id = require( './element/properties/id' )
const innerHTML = require( './element/properties/innerHTML' )
const lastElementChild = require( './element/properties/lastElementChild' )
const name = require( './element/properties/name' )
const nextElementSibling = require( './element/properties/nextElementSibling' )
const outerHTML = require( './element/properties/outerHTML' )
const previousElementSibling = require( './element/properties/previousElementSibling' )
const tagName = require( './element/properties/tagName' )
const title = require( './element/properties/title' )

const cloneNode = require( './node/methods/cloneNode' )
const isEqualNode = require( './node/methods/isEqualNode' )
const isSameNode = require( './node/methods/isSameNode' )
const normalize = require( './node/methods/normalize' )
const toString = require( './node/methods/toString' )
const whitespace = require( './node/methods/whitespace' )

const baseURI = require( './node/properties/baseURI' )
const innerText = require( './node/properties/innerText' )
const nodeName = require( './node/properties/nodeName' )
const nodeValue = require( './node/properties/nodeValue' )
const ownerDocument = require( './node/properties/ownerDocument' )
const parentElement = require( './node/properties/parentElement' )
const textContent = require( './node/properties/textContent' )

module.exports = [
  closest, getAttribute, getAttributes, getElementsByClassName,
  getElementsByTagName, hasAttribute, hasAttributes, matches, querySelector,
  querySelectorAll, removeAttribute, select, selectAll, setAttribute,
  setAttributes,

  attributes, childElementCount, children, classList, className, dataset,
  firstElementChild, id, innerHTML, lastElementChild, name, nextElementSibling,
  outerHTML, previousElementSibling, tagName, title,

  cloneNode, isEqualNode, isSameNode, normalize, toString, whitespace,

  baseURI, innerText, nodeName, nodeValue, ownerDocument, parentElement,
  textContent
]
