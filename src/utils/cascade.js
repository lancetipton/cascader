/** @module Utils */

import { get, isObj, isStr, isArr, deepMerge, softFalsy, reduceObj } from 'jsutils'

/**
 * Adds events to the props of elements based on type of Id
 * If both match, Id overrides type
 * @function
 * @param {Object} events - Contains events methods and the types to match to 
 * @param {*} type - Type of the current node
 * @param {*} props - props of the current node
 *
 * @returns {Object} - Built cascade node props with events added
 */
const addEvents = (events, type, props) => (
  reduceObj(events, (evtName, addTo) => {
    // Check if there's a type match
    addTo[type] && (props[evtName] = addTo[type])
    // ID should override type, so check if there's a id match after type
    addTo[props.id] && (props[evtName] = addTo[props.id])

    return props
  })
)

/**
 * Builds the props of a cascade node
 * @function
 * @param {Object} cascade - The nodes to be rendered
 * @param {Object} metadata - Extra data for cascade nodes
 * @param {Object} parent - Cascade nodes parent data
 *
 * @returns {Object} - Built cascade node props
 */
export const buildCascadeProps = (cascade, metadata, parent) => {
  // Get the props directly on the cascade node
  const inlineProps = get(cascade, [ '1' ], {})

  // Get the catalog from finding the cascade node metadata
  const { catalog, events } = metadata

  // Get the id for the cascade, if no Id in the props, try to get the id from the position
  const cascadeId = getCascadeId(cascade, inlineProps)

  // If no id on the inline props, then no way to get metadata props || parent props
  // If there is an id, get the metadata && parent props
  const cascadeProps = !cascadeId
    ? inlineProps
    : deepMerge(
        get(parent, [ 'props', 'children', cascadeId ]),
        catalog[cascadeId],
        inlineProps
      )

  // Ensure a key is added to the props, use either the ID or the pos
  // If not other key can be used, use the pos from the metadata
  cascadeProps.key = cascadeProps.key || cascadeProps.id || cascadeProps.pos || metadata.pos
  
  return cascade['0'] && isObj(events)
    ? addEvents(events, cascade['0'], cascadeProps)
    : cascadeProps
}

/**
 * Gets the ID of a cascade node from the passed in id || cascade node || props
 * @function
 * @param {Object} cascade - Node describing a UI element
 * @param {Object} props - properties of the cascade node
 * @param {string} id - ID property of the cascade node
 *
 * @returns {string} - ID of the cascade node
 */
export const getCascadeId = (cascade, props, id) => (
  (isStr(id) && id) ||
  (isObj(cascade) && (
    get(cascade, [ '1', 'id' ]) ||
    !props && get(cascade, [ 'id' ]))
  ) ||
  get(props, [ 'id' ])
)