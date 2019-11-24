import React from 'react'
import { isObj, get, capitalize, isFunc } from 'jsutils'
import { getAltRender, getCascadeId } from '../utils'

// Helper to known then running tests
const isTest = process.env.NODE_ENV === 'test'


class Registry {

  // Cache to hold cache items
  components = {}
  cached = {}

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

    this.components = { ...this.components, ...compList, }

    if(isTest) return this.components
  }

  /**
   * Removes a single component or all components
   * @memberof Registry
   * @param {string} key - key of a registered component
   *
   * @returns {void}
   */
  unset(key) { key ? (delete this.components[key]) : (this.components = {}) }

  /**
   * Gets a single registered component or all components
   * @memberof Registry
   * @param {string} key - key of a registered component
   *
   * @returns {React Component} - Matching registered component || All components
   */
  get(key){ return (key && this.components[key] || this.components) }

  /**
  * Finds a registered React Component that matches the cascade node
  * <br> Looks for components in this order
  * <br> 1. altRender || render key on the catalogProps of the cascade
  * <br> 2. capitalize(node[0]) - The type of the passed in cascade node but capitalized
  * <br> 3. node[0] (type) - The type of the passed in cascade node
  * <br> 4. node[1].id (id) - The id of the passed in cascade node
  * <br> 5. If no component is found, node[0] (type) is returned
  * @memberof Registry
  * @param {Object} cascade - Node describing a UI element
  * @param {Object} props - properties of the cascade node
  * @param {Object} catalog - Lookup table for cascade nodes
  *
  * @returns {React Component} - Matching registered component
  */
  find(cascade, props, catalog){

    // Find the Id of the cascade node
    const cascadeId = getCascadeId(cascade, props)

    // Use cascade Id to get the render key of the cascade node
    const cascadeKey = cascadeId && getAltRender(catalog, cascadeId)
    
    // Get the cascade type
    const type = cascade[0]

    // Look for the component by key, type, id || just return the original type
    return this.components[cascadeKey] ||
      this.components[capitalize(type)] ||
      this.components[type] ||
      this.components[cascadeId] ||
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

export const getCached = id => registry.cached[id]

export const addCached = (id, comp=null) => {
  registry.cached[id] = comp
  return registry.cached[id]
}
