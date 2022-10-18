export declare type TCatalogProps = {
    id: string;
    pos: string;
    key: string;
    [key: string]: any;
};
export declare type TMetaCatalog = {
    [key: string]: TCatalogProps;
};
export declare type TMetaEvents = {
    [key: string]: any;
};
export declare type TMetaLookup = {
    key: string;
    altKey: string;
    [key: string]: any;
};
export declare type TMetaConfigComps = {
    lookup: TMetaLookup;
    [key: string]: any;
};
export declare type TMetaConfig = {
    components: TMetaConfigComps;
    [key: string]: any;
};
export declare type TMetaStyles = {
    [key: string]: any;
};
export declare type TGetMetaCatalog = (catalog?: TMetaCatalog) => TMetaCatalog;
export declare type TCascadeMeta = {
    pos?: string;
    index?: number;
    parentPos?: string;
    isLoading?: string;
    styles?: TMetaStyles;
    catalog: TMetaCatalog;
    events?: TMetaEvents;
    config?: TMetaConfig;
    buildCatalog?: boolean;
};
