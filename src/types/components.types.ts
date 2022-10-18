import { ComponentType, ComponentClass, FC, ReactNode } from 'react'
import { TCascadeMeta } from './metadata.types'
import { TCascadeNode, TNodeProps } from './cascader.types'

export type TFindComponent = (
  cascade:TCascadeNode,
  props:TNodeProps,
  meta:TCascadeMeta,
  parent?:TNodeProps
) => string | TComponent

export type TComponent = ComponentType<any>
export type TComponentList = {
  [key: string]: TComponent
}

export type TCachedComponents = {
  [key: string]: TComponent
}

export type TReactComp = FC<any> | ComponentClass<any, any> | string
