import { ComponentType, ComponentClass, FC } from 'react';
import { TCascadeMeta } from './metadata.types';
import { TCascadeNode, TNodeProps } from './cascader.types';
export declare type TFindComponent = (cascade: TCascadeNode, props: TNodeProps, meta: TCascadeMeta, parent?: TNodeProps) => string | TComponent;
export declare type TComponent = ComponentType<any>;
export declare type TComponentList = {
    [key: string]: TComponent;
};
export declare type TCachedComponents = {
    [key: string]: TComponent;
};
export declare type TReactComp = FC<any> | ComponentClass<any, any> | string;
