/** @module Utils */
import type { TNodeProps, TCascadeMeta, TCascadeNode, TCascadeParent } from '../types';
/**
 * Builds the props of a cascade node
 */
export declare const buildCascadeProps: (cascade: TCascadeNode, metadata: TCascadeMeta, parent: TCascadeParent) => TNodeProps;
/**
 * Gets the ID of a cascade node from the passed in id || cascade node || props
 */
export declare const getCascadeId: (cascade: TCascadeNode, props: TNodeProps, id?: string) => string;
