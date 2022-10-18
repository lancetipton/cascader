// src/cascader/cascader.ts
import { useEffect, createElement } from "react";

// src/register/register.ts
import { isObj as isObj3, get as get2, capitalize, isFunc, isStr as isStr3 } from "@keg-hub/jsutils";

// src/utils/cascade.ts
import { get, isObj, isStr, deepMerge, reduceObj } from "@keg-hub/jsutils";
var addEvents = (events, type, props) => reduceObj(events, (evtName, addTo) => {
  addTo[type] && (props[evtName] = addTo[type]);
  addTo[props.id] && (props[evtName] = addTo[props.id]);
  return props;
});
var buildCascadeProps = (cascade, metadata, parent) => {
  const inlineProps = get(cascade, ["1"], {});
  const { catalog, events } = metadata;
  const cascadeId = getCascadeId(cascade, inlineProps);
  const cascadeProps = !cascadeId ? inlineProps : deepMerge(
    get(parent, ["props", "children", cascadeId]),
    catalog[cascadeId],
    inlineProps
  );
  cascadeProps.key = cascadeProps.key || cascadeProps.id || cascadeProps.pos || metadata.pos;
  return cascade["0"] && isObj(events) ? addEvents(events, cascade["0"], cascadeProps) : cascadeProps;
};
var getCascadeId = (cascade, props, id) => isStr(id) && id || isObj(cascade) && (get(cascade, ["1", "id"]) || !props && get(cascade, ["id"])) || get(props, ["id"]);

// src/utils/catalog.ts
import { isObj as isObj2, isStr as isStr2, isArr, uuid } from "@keg-hub/jsutils";
var getCatalogProps = (catalog, id) => {
  if (!isObj2(catalog) || !isStr2(id)) {
    console.warn(`getCatalogProps requires a catalog object, and an id!`, catalog, id);
    return;
  }
  return catalog[id];
};
var updateCatalogProps = (catalogProps, props, metadata) => {
  const { pos, catalog } = metadata;
  props.id && (!catalogProps.id || catalogProps.id !== props.id) && (catalogProps = { ...catalogProps, id: props.id });
  isStr2(pos) && pos !== catalogProps.pos && (catalogProps = { ...catalogProps, pos });
  catalog[props.id] !== catalogProps && (metadata.catalog = { ...catalog, [props.id]: catalogProps });
};
var getAltRender = (catalog, id, lookup) => {
  lookup = { key: "altRender", altKey: "render", ...lookup || {} };
  const catalogProps = getCatalogProps(catalog, id);
  return isObj2(catalogProps) && (catalogProps[lookup.key] || catalogProps[lookup.altKey]);
};

// src/utils/config.ts
import { deepMerge as deepMerge2 } from "@keg-hub/jsutils";
var defConfig = {
  constants: {
    CASCADE_LOADING: "CASCADE_LOADING"
  },
  components: {
    lookup: {
      key: "altRender",
      altKey: "render",
      capitalize: true,
      type: true,
      id: true
    }
  },
  catalog: {
    build: true
  }
};
var buildConfig = (config = {}) => {
  return deepMerge2(defConfig, config);
};

// src/register/register.ts
var isTest = process.env.NODE_ENV === "test";
var Registry = class {
  cached = {};
  components = {};
  customFind;
  register = (compList) => {
    if (!isObj3(compList))
      return console.warn(`Cascade register method only accepts an object as it's first argument!`);
    this.components = { ...this.components, ...compList };
    return this.components;
  };
  unset = (key) => key ? delete this.components[key] : this.components = {};
  get = (key) => key ? this.components[key] : this.components;
  find = (cascade, props, { catalog, config }) => {
    const lookup = get2(config, ["components", "lookup"], {});
    if (!cascade)
      return console.warn(`Find requires a cascade object as it's first argument`, cascade);
    if (!isObj3(lookup))
      return console.warn(`config.component.lookup must be of type object`, lookup);
    const cascadeId = getCascadeId(cascade, props);
    const renderKey = cascadeId && getAltRender(
      catalog,
      cascadeId,
      lookup
    );
    const type = cascade[0];
    return this.components[renderKey] || lookup.capitalize && this.components[capitalize(type)] || lookup.type && this.components[type] || lookup.id && this.components[cascadeId] || type;
  };
  clear = () => {
    this.cached = {};
    this.unset();
  };
};
var registry = new Registry();
var registerCustomFind = (customFind) => !customFind ? registry.customFind = void 0 : isFunc(customFind) && (registry.customFind = customFind.bind(registry));
var registerComponents = registry.register;
var findComponent = (cascade, props, meta, parent) => isFunc(registry.customFind) ? registry.customFind(cascade, props, meta, parent) : registry.find(cascade, props, meta);
var getCached = (id) => {
  return registry.cached[id];
};
var addCached = (id, comp = null) => {
  if (!isStr3(id)) {
    console.warn(`addCached requires an Id as a string for the first arguemnt!`, id);
    return;
  }
  if (!isFunc(comp)) {
    console.warn(`addCached requires a function component as the second argument!`, comp);
    return;
  }
  registry.cached[id] = comp;
  return registry.cached[id];
};
var clear = registry.clear;

// src/cascader/cascader.ts
import { isObj as isObj4, isArr as isArr2, isFunc as isFunc2, eitherObj, isColl, get as get3, checkCall } from "@keg-hub/jsutils";
var getComponent = (cascade, metadata, props, parent) => {
  const { catalog, buildCatalog } = metadata;
  const { id } = props;
  const CachedComp = id && getCached(id);
  const FoundComp = CachedComp || findComponent(cascade, props, metadata, parent);
  id && !CachedComp && isFunc2(FoundComp) && addCached(id, FoundComp);
  id && buildCatalog && updateCatalogProps(
    eitherObj(catalog[id], {}),
    props,
    metadata
  );
  return FoundComp;
};
var getRenderEl = (cascade, metadata, props, parent) => {
  return createElement(
    getComponent(cascade, metadata, props, parent),
    props,
    renderCascade(
      cascade[2],
      metadata,
      { cascade, parent, props }
    )
  );
};
var buildCascadeNode = (cascade, metadata, parent) => {
  return !cascade || !cascade[0] ? null : getRenderEl(
    cascade,
    metadata,
    eitherObj(buildCascadeProps(cascade, metadata, parent), {}),
    parent
  );
};
var loopCascadeArray = (cascade, metadata, parent) => {
  const curPos = metadata.pos;
  return cascade.map((child, index) => {
    metadata.pos = `${curPos}.2.${index}`;
    return renderCascade(child, metadata, parent);
  });
};
var renderCascade = (cascade, metadata, parent) => {
  return !isColl(cascade) ? cascade : cascade[0] === metadata.isLoading ? null : isArr2(cascade) ? loopCascadeArray(cascade, metadata, parent) : buildCascadeNode(cascade, metadata, parent);
};
var Cascader = (props) => {
  if (!isObj4(props) || !isColl(props.cascade)) {
    console.warn(`Cascader requires a cascade object as a prop!`, props);
    return null;
  }
  if (props.catalog && !isObj4(props.catalog)) {
    console.warn(`Cascader requires the catalog prop to be an object or falsy!`, props);
    return null;
  }
  if (props.events && !isObj4(props.events)) {
    console.warn(`Cascader requires the events prop to be an object or falsy!`, props);
    return null;
  }
  const config = buildConfig(props.config);
  const metadata = {
    catalog: isObj4(props.catalog) && props.catalog || {},
    styles: props.styles,
    events: props.events,
    config,
    isLoading: get3(config, ["constants", "CASCADE_LOADING"]),
    buildCatalog: props.getCatalog && get3(config, ["catalog", "build"]) !== false,
    pos: "0"
  };
  props.getCatalog && useEffect(() => checkCall(props.getCatalog, metadata.catalog));
  return renderCascade(props.cascade, metadata, eitherObj(props.parent, {}));
};
export {
  Cascader,
  registerComponents,
  registerCustomFind
};
//# sourceMappingURL=index.mjs.map
