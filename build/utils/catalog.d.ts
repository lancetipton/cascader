/** @module Utils */
import type { TNodeProps, TMetaLookup, TMetaCatalog, TCascadeMeta, TCascadeNode, TCatalogProps } from '../types';
/**
 * Gets the catalog props based on an ID
 */
export declare const getCatalogProps: (catalog: TMetaCatalog, id: string) => TCatalogProps;
/**
 * Updated the catalogProps ID and position (pos)
 */
export declare const updateCatalogProps: (catalogProps: TCatalogProps, props: TNodeProps, metadata: TCascadeMeta) => void;
/**
 * Gets the component key
 * @function
 * @param {Object} catalog - Lookup table for cascade nodes
 * @param {string} id - ID of the cascade node
 * @param {Object} lookup - Config options for how to lookup the render key
 *
 * @returns {string} - Type of component to render (div / img ) || ( React Component )
 */
export declare const getAltRender: (catalog: TMetaCatalog, id: string, lookup?: TMetaLookup) => any;
/**
 * Wrapper around buildCatalog, so the catalog object is managed internally
 * @param {Object} cascade - Root cascade node to build the catalog from
 * @param {boolean} allProps - Should include all props from the cascade node
 *
 * @returns {Object} - Built catalog object
 */
export declare const catalogFromCascade: (cascade: TCascadeNode | TCascadeNode[] | string, allProps: boolean) => TMetaCatalog;
