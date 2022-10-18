/** @module Utils */
import type {
  TNodeProps,
  TMetaEvents,
  TCascadeMeta,
  TCascadeNode,
  TCascadeParent,
} from '../types'
import { get, isObj, isStr, deepMerge, reduceObj } from '@keg-hub/jsutils'

/**
 * Adds events to the props of elements based on type of Id
 * If both match, Id overrides type

 */
const addEvents = (events:TMetaEvents, type:any, props:TNodeProps):TCascadeNode => (
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
 */
export const buildCascadeProps = (
  cascade:TCascadeNode,
  metadata:TCascadeMeta,
  parent:TCascadeParent
):TNodeProps => {
  // Get the props directly on the cascade node
  const inlineProps = get(cascade, [ '1' ], {})

  // Get the catalog from finding the cascade node metadata
  const { catalog, events } = metadata

  // Get the id for the cascade, if no Id in the props, try to get the id from the position
  const cascadeId = getCascadeId(cascade, inlineProps)

  // If no id on the inline props, then no way to get metadata props || parent props
  // If there is an id, get the metadata && parent props
  const cascadeProps = !cascadeId
    ? inlineProps as TNodeProps
    : deepMerge(
        get(parent, [ 'props', 'children', cascadeId ]),
        catalog[cascadeId],
        inlineProps
      ) as TNodeProps

  // Ensure a key is added to the props, use either the ID or the pos
  // If not other key can be used, use the pos from the metadata
  cascadeProps.key = cascadeProps.key || cascadeProps.id || cascadeProps.pos || metadata.pos
  
  return cascade['0'] && isObj(events)
    ? addEvents(events, cascade['0'], cascadeProps)
    : cascadeProps
}

/**
 * Gets the ID of a cascade node from the passed in id || cascade node || props
 */
export const getCascadeId = (
  cascade:TCascadeNode,
  props:TNodeProps,
  id?:string
):string => (
  (isStr(id) && id)
  || (isObj(cascade) && ( get(cascade, [ '1', 'id' ]) || !props && get(cascade, [ 'id' ])))
  || get(props, [ 'id' ])
)