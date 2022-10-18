/** @module Registry */
import type { TNodeProps, TComponent, TCascadeNode, TCascadeMeta, TFindComponent, TComponentList } from '../types';
/**
 * Register a custom Registry.find method
 * @function
 *
 * @param {function} customFind - custom function to override the default find function
 */
export declare const registerCustomFind: (customFind: TFindComponent) => TFindComponent;
/**
 * Register a group of components to be searched when rendering
 * @function
 * @param {Object} compList - Group of React Components
 *
 * @returns {void}
 */
export declare const registerComponents: (compList: TComponentList) => void | TComponentList;
/**
 * Removes a single component from the component registry
 * @function
 * @param {string} key - key of component to remove
 *
 * @returns {void}
 */
export declare const removeComponent: (key: string) => {};
/**
 * Removes all registered components
 * @function
 *
 * @returns {void}
 */
export declare const removeComponents: () => {};
/**
 * Gets a single registered component based on the passed in key
 * @function
 * @param {string} key - key of a registered component
 *
 * @returns {React Component} - Matching registered component
 */
export declare const getComponent: (key: string) => TComponent | TComponentList;
/**
 * Gets all registered components
 * @function
 *
 * @returns {Object} - Key value pair of registered components
 */
export declare const getComponents: () => TComponent | TComponentList;
/**
 * Searches for a component in the registered components
 * <br> If a customFind method is set it will call that method instead
 * @function
 * @returns {Object} - Key value pair of registered components
 */
export declare const findComponent: (cascade: TCascadeNode, props: TNodeProps, meta: TCascadeMeta, parent?: TNodeProps) => string | void | TComponent;
/**
 * Gets a cached component based on the passed in id
 * @param {string} id - id of a registered component
 *
 * @returns {React Component} - Matching cached component
 */
export declare const getCached: (id: string) => TComponent;
/**
 * Adds a cached component based on the passed in id
 * @function
 */
export declare const addCached: (id: string, comp?: TComponent) => TComponent;
/**
 * Clears out cached components based on passed in id
 * <br> If no id, it will remove all cached components
 * <br> If an id is passed, it will remove only the matching cached item
 */
export declare const clearCache: (id: string) => {};
/**
 * Clears out cache and components
 * @function
 *
 * @returns {void}
 */
export declare const clear: () => void;
