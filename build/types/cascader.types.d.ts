import { TMetaEvents, TMetaConfig, TMetaStyles, TMetaCatalog, TGetMetaCatalog } from './metadata.types';
export declare type TCascadeProps = {
    [key: string]: any;
};
export declare type TCascadeParent = {
    [key: string]: any;
};
export declare type TNodeProps = {
    id?: string;
    pos?: string;
    key?: string;
    [key: string]: string | number | Record<any, any>;
};
export declare type TCascadeItem = TCascadeNode | TCascadeNode[] | string;
export declare type TCascadeNode = {
    '0': string;
    '1': TNodeProps;
    '2': TCascadeItem;
};
export declare type TCascade = {
    cascade: TCascadeNode;
    catalog?: TMetaCatalog;
    config?: TMetaConfig;
    events?: TMetaEvents;
    parent?: TCascadeNode;
    styles?: TMetaStyles;
    getCatalog?: TGetMetaCatalog;
};
