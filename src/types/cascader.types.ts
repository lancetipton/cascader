import {
  TMetaEvents,
  TMetaConfig,
  TMetaStyles,
  TMetaCatalog,
  TGetMetaCatalog 
} from './metadata.types'

export type TCascadeProps = {
  [key: string]: any
}

export type TCascadeParent = {
  [key: string]: any
}

export type TNodeProps = {
  id?: string
  pos?: string
  key?: string
  [key: string]: string | number | Record<any, any>
}

export type TCascadeItem = TCascadeNode | TCascadeNode[] | string

export type TCascadeNode = {
  '0': string,
  '1': TNodeProps
  '2': TCascadeItem
}

export type TCascade = {
  cascade: TCascadeNode
  catalog?: TMetaCatalog
  config?: TMetaConfig
  events?: TMetaEvents
  parent?: TCascadeNode
  styles?: TMetaStyles
  getCatalog?: TGetMetaCatalog
}


