"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Cascader: () => Cascader,
  registerComponents: () => registerComponents,
  registerCustomFind: () => registerCustomFind
});
module.exports = __toCommonJS(src_exports);

// src/cascader/cascader.ts
var import_react = require("react");

// src/register/register.ts
var import_jsutils4 = require("@keg-hub/jsutils");

// src/utils/cascade.ts
var import_jsutils = require("@keg-hub/jsutils");
var addEvents = (events, type, props) => (0, import_jsutils.reduceObj)(events, (evtName, addTo) => {
  addTo[type] && (props[evtName] = addTo[type]);
  addTo[props.id] && (props[evtName] = addTo[props.id]);
  return props;
});
var buildCascadeProps = (cascade, metadata, parent) => {
  const inlineProps = (0, import_jsutils.get)(cascade, ["1"], {});
  const { catalog, events } = metadata;
  const cascadeId = getCascadeId(cascade, inlineProps);
  const cascadeProps = !cascadeId ? inlineProps : (0, import_jsutils.deepMerge)(
    (0, import_jsutils.get)(parent, ["props", "children", cascadeId]),
    catalog[cascadeId],
    inlineProps
  );
  cascadeProps.key = cascadeProps.key || cascadeProps.id || cascadeProps.pos || metadata.pos;
  return cascade["0"] && (0, import_jsutils.isObj)(events) ? addEvents(events, cascade["0"], cascadeProps) : cascadeProps;
};
var getCascadeId = (cascade, props, id) => (0, import_jsutils.isStr)(id) && id || (0, import_jsutils.isObj)(cascade) && ((0, import_jsutils.get)(cascade, ["1", "id"]) || !props && (0, import_jsutils.get)(cascade, ["id"])) || (0, import_jsutils.get)(props, ["id"]);

// src/utils/catalog.ts
var import_jsutils2 = require("@keg-hub/jsutils");
var getCatalogProps = (catalog, id) => {
  if (!(0, import_jsutils2.isObj)(catalog) || !(0, import_jsutils2.isStr)(id)) {
    console.warn(`getCatalogProps requires a catalog object, and an id!`, catalog, id);
    return;
  }
  return catalog[id];
};
var updateCatalogProps = (catalogProps, props, metadata) => {
  const { pos, catalog } = metadata;
  props.id && (!catalogProps.id || catalogProps.id !== props.id) && (catalogProps = { ...catalogProps, id: props.id });
  (0, import_jsutils2.isStr)(pos) && pos !== catalogProps.pos && (catalogProps = { ...catalogProps, pos });
  catalog[props.id] !== catalogProps && (metadata.catalog = { ...catalog, [props.id]: catalogProps });
};
var getAltRender = (catalog, id, lookup) => {
  lookup = { key: "altRender", altKey: "render", ...lookup || {} };
  const catalogProps = getCatalogProps(catalog, id);
  return (0, import_jsutils2.isObj)(catalogProps) && (catalogProps[lookup.key] || catalogProps[lookup.altKey]);
};

// src/utils/config.ts
var import_jsutils3 = require("@keg-hub/jsutils");
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
  return (0, import_jsutils3.deepMerge)(defConfig, config);
};

// src/register/register.ts
var isTest = process.env.NODE_ENV === "test";
var Registry = class {
  cached = {};
  components = {};
  customFind;
  register = (compList) => {
    if (!(0, import_jsutils4.isObj)(compList))
      return console.warn(`Cascade register method only accepts an object as it's first argument!`);
    this.components = { ...this.components, ...compList };
    return this.components;
  };
  unset = (key) => key ? delete this.components[key] : this.components = {};
  get = (key) => key ? this.components[key] : this.components;
  find = (cascade, props, { catalog, config }) => {
    const lookup = (0, import_jsutils4.get)(config, ["components", "lookup"], {});
    if (!cascade)
      return console.warn(`Find requires a cascade object as it's first argument`, cascade);
    if (!(0, import_jsutils4.isObj)(lookup))
      return console.warn(`config.component.lookup must be of type object`, lookup);
    const cascadeId = getCascadeId(cascade, props);
    const renderKey = cascadeId && getAltRender(
      catalog,
      cascadeId,
      lookup
    );
    const type = cascade[0];
    return this.components[renderKey] || lookup.capitalize && this.components[(0, import_jsutils4.capitalize)(type)] || lookup.type && this.components[type] || lookup.id && this.components[cascadeId] || type;
  };
  clear = () => {
    this.cached = {};
    this.unset();
  };
};
var registry = new Registry();
var registerCustomFind = (customFind) => !customFind ? registry.customFind = void 0 : (0, import_jsutils4.isFunc)(customFind) && (registry.customFind = customFind.bind(registry));
var registerComponents = registry.register;
var findComponent = (cascade, props, meta, parent) => (0, import_jsutils4.isFunc)(registry.customFind) ? registry.customFind(cascade, props, meta, parent) : registry.find(cascade, props, meta);
var getCached = (id) => {
  return registry.cached[id];
};
var addCached = (id, comp = null) => {
  if (!(0, import_jsutils4.isStr)(id)) {
    console.warn(`addCached requires an Id as a string for the first arguemnt!`, id);
    return;
  }
  if (!(0, import_jsutils4.isFunc)(comp)) {
    console.warn(`addCached requires a function component as the second argument!`, comp);
    return;
  }
  registry.cached[id] = comp;
  return registry.cached[id];
};
var clear = registry.clear;

// src/cascader/cascader.ts
var import_jsutils5 = require("@keg-hub/jsutils");
var getComponent = (cascade, metadata, props, parent) => {
  const { catalog, buildCatalog } = metadata;
  const { id } = props;
  const CachedComp = id && getCached(id);
  const FoundComp = CachedComp || findComponent(cascade, props, metadata, parent);
  id && !CachedComp && (0, import_jsutils5.isFunc)(FoundComp) && addCached(id, FoundComp);
  id && buildCatalog && updateCatalogProps(
    (0, import_jsutils5.eitherObj)(catalog[id], {}),
    props,
    metadata
  );
  return FoundComp;
};
var getRenderEl = (cascade, metadata, props, parent) => {
  return (0, import_react.createElement)(
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
    (0, import_jsutils5.eitherObj)(buildCascadeProps(cascade, metadata, parent), {}),
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
  return !(0, import_jsutils5.isColl)(cascade) ? cascade : cascade[0] === metadata.isLoading ? null : (0, import_jsutils5.isArr)(cascade) ? loopCascadeArray(cascade, metadata, parent) : buildCascadeNode(cascade, metadata, parent);
};
var Cascader = (props) => {
  if (!(0, import_jsutils5.isObj)(props) || !(0, import_jsutils5.isColl)(props.cascade)) {
    console.warn(`Cascader requires a cascade object as a prop!`, props);
    return null;
  }
  if (props.catalog && !(0, import_jsutils5.isObj)(props.catalog)) {
    console.warn(`Cascader requires the catalog prop to be an object or falsy!`, props);
    return null;
  }
  if (props.events && !(0, import_jsutils5.isObj)(props.events)) {
    console.warn(`Cascader requires the events prop to be an object or falsy!`, props);
    return null;
  }
  const config = buildConfig(props.config);
  const metadata = {
    catalog: (0, import_jsutils5.isObj)(props.catalog) && props.catalog || {},
    styles: props.styles,
    events: props.events,
    config,
    isLoading: (0, import_jsutils5.get)(config, ["constants", "CASCADE_LOADING"]),
    buildCatalog: props.getCatalog && (0, import_jsutils5.get)(config, ["catalog", "build"]) !== false,
    pos: "0"
  };
  props.getCatalog && (0, import_react.useEffect)(() => (0, import_jsutils5.checkCall)(props.getCatalog, metadata.catalog));
  return renderCascade(props.cascade, metadata, (0, import_jsutils5.eitherObj)(props.parent, {}));
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Cascader,
  registerComponents,
  registerCustomFind
});
//# sourceMappingURL=index.cjs.map
