/** @module Registry */

import type {
  TNodeProps,
  TComponent,
  TMetaLookup,
  TCascadeNode,
  TCascadeMeta,
  TFindComponent,
  TComponentList,
  TCachedComponents,
} from '../types'

import { isObj, get, capitalize, isFunc, isStr } from '@keg-hub/jsutils'
import { getAltRender, getCascadeId } from '../utils'

// Helper to known then running tests
const isTest = process.env.NODE_ENV === 'test'

/**
 * Eventually want to have multiple registries, which can be referenced by id
 * <br> Which why this is a class
 * <br> Then we could create multiple Registry instance
 * <br> This would allow different registered components for different cascade instances
 * @class Registry
 */
class Registry {

  // Cache to hold cache items
  cached:TCachedComponents = {}
  components:TComponentList = {}
  customFind?:TFindComponent

  /**
  * Register a group of components to be searched when rendering
  * @memberof Registry
  * @function
  * @param {Object} compList - Group of React Components
  *
  * @returns {void}
  */
  register = (compList:TComponentList) => {
    if(!isObj(compList))
      return console.warn(`Cascade register method only accepts an object as it's first argument!`)
    
    // Join the current components with the passed in compList
    this.components = { ...this.components, ...compList, }

    return this.components
  }

  /**
   * Removes a single component or all components
   * @memberof Registry
   */
  unset = (key?:string) => (key ? (delete this.components[key]) : (this.components = {}))

  /**
   * Gets a single registered component or all components
   * @memberof Registry
   */
  get = (key?:string) => (key ? this.components[key] : this.components)

  /**
  * Finds a registered React Component that matches the cascade node
  * <br> Looks for components in this order
  * <br> 1. altRender || render key on the catalogProps of the cascade
  * <br> 2. capitalize(node[0]) - The type of the passed in cascade node but capitalized
  * <br> 3. node[0] (type) - The type of the passed in cascade node
  * <br> 4. node[1].id (id) - The id of the passed in cascade node
  * <br> 5. If no component is found, node[0] (type) is returned
  * @memberof Registry
  * @function
  * @param {Object} cascade - Node describing a UI element
  * @param {Object} props - properties of the cascade node
  * @param {Object} catalog - Lookup table for cascade nodes
  *
  * @returns {React Component} - Matching registered component
  */
  find = (
    cascade:TCascadeNode,
    props:TNodeProps,
    { catalog, config }:TCascadeMeta,
  ) => {
    
    const lookup = get(config, [ 'components', 'lookup' ], {})

    // If not cascade just return
    if(!cascade)
      return console.warn(`Find requires a cascade object as it's first argument`, cascade)
    
    if(!isObj(lookup))
      return console.warn(`config.component.lookup must be of type object`, lookup)

    // Find the Id of the cascade node
    const cascadeId = getCascadeId(cascade, props)

    // Use cascade Id to get the render key of the cascade node
    const renderKey = cascadeId && getAltRender(
      catalog,
      cascadeId,
      lookup as TMetaLookup
    )
    
    // Get the cascade type
    const type = cascade[0]

    // Look for the component by key, type, id || just return the original type
    return this.components[renderKey] ||
      lookup.capitalize && this.components[capitalize(type)] ||
      lookup.type && this.components[type] ||
      lookup.id && this.components[cascadeId] ||
      type
  }

  /**
  * Clears out cache and components
  * @memberof Registry
  * @function
  *
  * @returns {void}
  */
  clear = () => {
    this.cached = {}
    this.unset()
  }

}

const registry = new Registry()

/**
 * Register a custom Registry.find method
 * @function
 *
 * @param {function} customFind - custom function to override the default find function
 */
export const registerCustomFind = (customFind:TFindComponent) => (
  !customFind
    ? (registry.customFind = undefined)
    : ( isFunc(customFind) && (registry.customFind = customFind.bind(registry)) )
)

/**
 * Register a group of components to be searched when rendering
 * @function
 * @param {Object} compList - Group of React Components
 *
 * @returns {void}
 */
export const registerComponents = registry.register

/**
 * Removes a single component from the component registry
 * @function
 * @param {string} key - key of component to remove
 *
 * @returns {void}
 */
export const removeComponent = (key:string) => isStr(key) && registry.unset(key)

/**
 * Removes all registered components
 * @function
 *
 * @returns {void}
 */
export const removeComponents = () => registry.unset()

/**
 * Gets a single registered component based on the passed in key
 * @function
 * @param {string} key - key of a registered component
 *
 * @returns {React Component} - Matching registered component
 */
export const getComponent = (key:string) => isStr(key) && registry.get(key)

/**
 * Gets all registered components
 * @function
 *
 * @returns {Object} - Key value pair of registered components
 */
export const getComponents = () => registry.get()

/**
 * Searches for a component in the registered components
 * <br> If a customFind method is set it will call that method instead
 * @function
 * @returns {Object} - Key value pair of registered components
 */
export const findComponent = (
  cascade:TCascadeNode,
  props:TNodeProps,
  meta:TCascadeMeta,
  parent?:TNodeProps
) => (
  isFunc(registry.customFind)
    ? registry.customFind(cascade, props, meta, parent)
    : registry.find(cascade, props, meta)
)

/**
 * Gets a cached component based on the passed in id
 * @param {string} id - id of a registered component
 *
 * @returns {React Component} - Matching cached component
 */
export const getCached = (id:string):TComponent => {
  return registry.cached[id as keyof typeof registry.cached]
}

/**
 * Adds a cached component based on the passed in id
 * @function
 */
export const addCached = (id:string, comp:TComponent=null):TComponent => {
  if(!isStr(id)){
    console.warn(`addCached requires an Id as a string for the first arguemnt!`, id)
    return
  }

  if(!isFunc(comp)){
    console.warn(`addCached requires a function component as the second argument!`, comp)
    return
  }

  registry.cached[id] = comp

  return registry.cached[id]
}

/**
 * Clears out cached components based on passed in id
 * <br> If no id, it will remove all cached components
 * <br> If an id is passed, it will remove only the matching cached item
 */
export const clearCache = (id:string) => {
  // If no id, clear all the cache
  if(!id) return registry.cached = {}
  
  // If an id is passed, remove just the matching cached component
  delete registry.cached[id]
}

/**
 * Clears out cache and components
 * @function
 *
 * @returns {void}
 */
export const clear = registry.clear