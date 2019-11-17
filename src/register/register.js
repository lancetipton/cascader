import { isObj, get } from 'jsutils'
import React from 'react'
import { getAltRender, findCascadeId } from '../utils'

// Helper to known then running tests
const isTest = process.env.NODE_ENV === 'test'

// Cache to hold registered components
let ComponentCache = {}

/**
 * Register a group of components to be searched when rendering
 * @param {Object} compList - Group of React Components
 *
 * @returns {void}
 */
export const register = compList => {
  if(!isObj(compList))
    return console.warn(`Cascade register method only accepts an object as it's first argument!`)

  ComponentCache = {
    ...ComponentCache,
    ...compList,
  }

  if(isTest) return ComponentCache

}

/**
 * Finds a registered React Component that matches the cascade node (key || id || type)
 * @param {Object} cascade - Node describing a UI element
 * @param {Object} metadata - Extra data for cascade nodes
 * @param {Object} metadata.catalog - Lookup table for cascade nodes
 * @param {Object} metadata.styles - Styles by size for cascade nodes
 * @param {Object} metadata.identity - Maps position to and id, and visa versa
 * @param {Object} props - properties of the cascade node
 * @param {Object} parent - Cascade nodes parent data
 * @param {Object} parent.cascade - Parent cascade node
 * @param {Object} parent.parent - Parent object of the parent cascade node
 * @param {Object} parent.props - Props object of the parent cascade node
 *
 * @returns {React Component} - Matching registered component
 */
export const getRegisteredComponent = (cascade, { catalog, identity }, props, parent) => {

  // Find the Id of the cascade node
  const cascadeId = findCascadeId(cascade, props, identity, parent)
    
  // Use cascade Id to get the render key of the cascade node
  const cascadeKey = cascadeId && getAltRender(catalog, cascadeId)

  // Look for the component by key, type, id
  return ComponentCache[cascadeKey] || ComponentCache[cascade[0]] || ComponentCache[cascadeId]
}