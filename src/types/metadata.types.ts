export type TCatalogProps = {
  id: string
  pos: string
  key: string
  [key: string]: any
}

export type TMetaCatalog = {
  [key: string]: TCatalogProps
}

export type TMetaEvents = {
  [key: string]: any
}

export type TMetaLookup = {
  key: string
  altKey: string
  [key: string]: any
}


export type TMetaConfigComps = {
  lookup: TMetaLookup
  [key: string]: any
}

export type TMetaConfig = {
  components: TMetaConfigComps
  [key: string]: any
}

export type TMetaStyles = {
  [key: string]: any
}

export type TGetMetaCatalog = (catalog?:TMetaCatalog) => TMetaCatalog

export type TCascadeMeta = {
  pos?: string,
  index?:number
  parentPos?:string,
  isLoading?:string
  styles?: TMetaStyles
  catalog: TMetaCatalog
  events?: TMetaEvents
  config?: TMetaConfig
  buildCatalog?: boolean
}
