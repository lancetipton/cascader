import React from 'react'
import { isObj, get, capitalize, isFunc } from 'jsutils'
import { getAltRender, findCascadeId, getCascadeId } from '../utils'

// Helper to known then running tests
const isTest = process.env.NODE_ENV === 'test'

// Cache to hold registered components
let components = {}

class Registry {

  /**
  * Register a group of components to be searched when rendering
  * @memberof Registry
  * @param {Object} compList - Group of React Components
  *
  * @returns {void}
  */
  register(compList){
    if(!isObj(compList))
      return console.warn(`Cascade register method only accepts an object as it's first argument!`)

    components = { ...components, ...compList, }

    if(isTest) return components
  }

  /**
   * Removes a single component or all components
   * @memberof Registry
   * @param {string} key - key of a registered component
   *
   * @returns {void}
   */
  unset(key) { key ? (delete components[key]) : (components = {}) }

  /**
   * Gets a single registered component or all components
   * @memberof Registry
   * @param {string} key - key of a registered component
   *
   * @returns {React Component} - Matching registered component || All components
   */
  get(key){ return (key && components[key] || components) }

  /**
  * Finds a registered React Component that matches the cascade node
  * <br> Looks for components in this order
  * <br> 1. altRender || render key on the catalogProps of the cascade
  * <br> 2. node[0] (type) - The type of the passed in cascade node
  * <br> 3. capitalize(node[0]) - The type of the passed in cascade node but capitalized
  * <br> 4. node[1].id (id) - The id of the passed in cascade node
  * <br> 5. If no component is found, node[0] (type) is returned
  * @memberof Registry
  * @param {Object} cascade - Node describing a UI element
  * @param {Object} props - properties of the cascade node
  * @param {Object} catalog - Lookup table for cascade nodes
  * @param {Object} identity - Maps position to and id, and visa versa
  * @param {Object} parent - Cascade nodes parent data
  * @param {Object} parent.cascade - Parent cascade node
  * @param {Object} parent.parent - Parent object of the parent cascade node
  * @param {Object} parent.props - Props object of the parent cascade node
  *
  * @returns {React Component} - Matching registered component
  */
  find(cascade, props, catalog, identity, parent){

    // Find the Id of the cascade node
    const cascadeId = !isObj(identity) || !isObj(parent)
      ? getCascadeId(cascade, props)
      : findCascadeId(cascade, props, identity, parent)

    // Use cascade Id to get the render key of the cascade node
    const cascadeKey = cascadeId && getAltRender(catalog, cascadeId)
    
    // Get the cascade type
    const type = cascade[0]

    // Look for the component by key, type, id || just return the original type
    return components[cascadeKey] ||
      components[capitalize(type)] ||
      components[type] ||
      components[cascadeId] ||
      type
  }

}

const registry = new Registry()

/**
 * Register a custom Registry.find method
 *
 * @param {function} customFind - custom function to override the default find function
 */
export const registerCustomFind = customFind => (
  isFunc(customFind) && (registry.customFind = customFind)
)

export const registerComponents = (...args) => registry.register(...args)

export const removeComponent = key => key && registry.unset(key)

export const removeComponents = () => registry.unset()

export const getComponent = key => key && registry.get(key)

export const getComponents = () => registry.get()

export const findComponent = (...args) => (
  isFunc(registry.customFind)
    ? registry.customFind(...args)
    : registry.find(...args)
)

