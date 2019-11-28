import React, { useEffect } from 'react';
import { isObj, reduceObj, get, isStr, deepMerge, isFunc, capitalize, isColl, checkCall, eitherObj, isArr } from 'jsutils';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var addEvents = function addEvents(events, type, props) {
  return reduceObj(events, function (evtName, addTo) {
    addTo[type] && (props[evtName] = addTo[type]);
    addTo[props.id] && (props[evtName] = addTo[props.id]);
    return props;
  });
};
var buildCascadeProps = function buildCascadeProps(cascade, metadata, parent) {
  var inlineProps = get(cascade, ['1'], {});
  var catalog = metadata.catalog,
      events = metadata.events;
  var cascadeId = getCascadeId(cascade, inlineProps);
  var cascadeProps = !cascadeId ? inlineProps : deepMerge(get(parent, ['props', 'children', cascadeId]), catalog[cascadeId], inlineProps);
  cascadeProps.key = cascadeProps.key || cascadeProps.id || cascadeProps.pos || metadata.pos;
  return cascade['0'] && isObj(events) ? addEvents(events, cascade['0'], cascadeProps) : cascadeProps;
};
var getCascadeId = function getCascadeId(cascade, props, id) {
  return isStr(id) && id || isObj(cascade) && (get(cascade, ['1', 'id']) || !props && get(cascade, ['id'])) || get(props, ['id']);
};

var getCatalogProps = function getCatalogProps(catalog, id) {
  return !isObj(catalog) || !isStr(id) ? console.warn("getCatalogProps requires a catalog object, and an id!", catalog, id) : catalog[id];
};
var updateCatalogProps = function updateCatalogProps(catalogProps, props, metadata) {
  var pos = metadata.pos,
      catalog = metadata.catalog;
  props.id && (!catalogProps.id || catalogProps.id !== props.id) && (catalogProps = _objectSpread2({}, catalogProps, {
    id: props.id
  }));
  isStr(pos) && pos !== catalogProps.pos && (catalogProps = _objectSpread2({}, catalogProps, {
    pos: pos
  }));
  catalog[props.id] !== catalogProps && (metadata.catalog = _objectSpread2({}, catalog, _defineProperty({}, props.id, catalogProps)));
};
var getAltRender = function getAltRender(catalog, id) {
  var lookup = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var catalogProps = getCatalogProps(catalog, id);
  return isObj(catalogProps) && isObj(lookup) && (lookup.key && catalogProps[lookup.key] || lookup.altKey && catalogProps[lookup.altKey]);
};

var defConfig = {
  constants: {
    CASCADE_LOADING: 'CASCADE_LOADING'
  },
  components: {
    lookup: {
      key: 'altRender',
      altKey: 'render',
      capitalizeType: true,
      type: true,
      id: true
    }
  }
};
var buildConfig = function buildConfig() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return deepMerge(defConfig, config);
};

var Registry = function Registry() {
  var _this = this;
  _classCallCheck(this, Registry);
  _defineProperty(this, "components", {});
  _defineProperty(this, "cached", {});
  _defineProperty(this, "register", function (compList) {
    if (!isObj(compList)) return console.warn("Cascade register method only accepts an object as it's first argument!");
    _this.components = _objectSpread2({}, _this.components, {}, compList);
    return _this.components;
  });
  _defineProperty(this, "unset", function (key) {
    return key ? delete _this.components[key] : _this.components = {};
  });
  _defineProperty(this, "get", function (key) {
    return key ? _this.components[key] : _this.components;
  });
  _defineProperty(this, "find", function (cascade, props, _ref) {
    var catalog = _ref.catalog,
        config = _ref.config;
    var lookup = get(config, ['components', 'lookup'], {});
    if (!cascade) return console.warn("Find requires a cascade object as it's first argument", cascade);
    if (!isObj(lookup)) return console.warn("config.component.lookup must be of type object", lookup);
    var cascadeId = getCascadeId(cascade, props);
    var renderKey = cascadeId && getAltRender(catalog, cascadeId, lookup);
    var type = cascade[0];
    return _this.components[renderKey] || lookup.capitalizeType && _this.components[capitalize(type)] || lookup.type && _this.components[type] || lookup.id && _this.components[cascadeId] || type;
  });
  _defineProperty(this, "clear", function () {
    _this.cached = {};
    _this.unset();
  });
};
var registry = new Registry();
var registerCustomFind = function registerCustomFind(customFind) {
  return !customFind ? registry.customFind = undefined : isFunc(customFind) && (registry.customFind = customFind.bind(registry));
};
var registerComponents = registry.register;
var findComponent = function findComponent() {
  return isFunc(registry.customFind) ? registry.customFind.apply(registry, arguments) : registry.find.apply(registry, arguments);
};
var getCached = function getCached(id) {
  return registry.cached[id];
};
var addCached = function addCached(id) {
  var comp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  if (!isStr(id)) return console.warn("addCached requires an Id as a string for the first arguemnt!", id);
  if (!isFunc(comp)) return console.warn("addCached requires a function component as the second argument!", comp);
  registry.cached[id] = comp;
  return registry.cached[id];
};

var getComponent = function getComponent(cascade, metadata, props, parent) {
  var catalog = metadata.catalog;
  var id = props.id;
  var CachedComp = id && getCached(id);
  var FoundComp = CachedComp || findComponent(cascade, props, metadata, parent);
  id && !CachedComp && isFunc(FoundComp) && addCached(id, FoundComp);
  id && updateCatalogProps(eitherObj(catalog[id], {}), props, metadata);
  return FoundComp;
};
var getRenderEl = function getRenderEl(cascade, metadata, props, parent) {
  return React.createElement(
  getComponent(cascade, metadata, props, parent), props,
  renderCascade(cascade[2], metadata, {
    cascade: cascade,
    parent: parent,
    props: props
  }));
};
var buildCascadeNode = function buildCascadeNode(cascade, metadata, parent) {
  return !cascade || !cascade[0] ? null : getRenderEl(cascade, metadata,
  eitherObj(buildCascadeProps(cascade, metadata, parent), {}), parent);
};
var loopCascadeArray = function loopCascadeArray(cascade, metadata, parent) {
  var curPos = metadata.pos;
  return cascade.map(function (child, index) {
    metadata.pos = "".concat(curPos, ".2.").concat(index);
    return renderCascade(child, metadata, parent);
  });
};
var renderCascade = function renderCascade(cascade, metadata, parent) {
  return !isColl(cascade) ? cascade
  : cascade[0] === get(metadata, ['config', 'constants', 'CASCADE_LOADING']) ? null : isArr(cascade)
  ? loopCascadeArray(cascade, metadata, parent) : buildCascadeNode(cascade, metadata, parent);
};
var Cascader = function Cascader(props) {
  if (!isObj(props) || !isColl(props.cascade)) {
    console.warn("Cascader requires a cascade object as a prop!", props);
    return null;
  }
  if (props.catalog && !isObj(props.catalog)) {
    console.warn("Cascader requires the catalog prop to be an object or falsy!", props);
    return null;
  }
  if (props.events && !isObj(props.events)) {
    console.warn("Cascader requires the events prop to be an object or falsy!", props);
    return null;
  }
  var metadata = {
    catalog: isObj(props.catalog) && props.catalog || {},
    styles: props.styles,
    events: props.events,
    config: buildConfig(props.config),
    pos: '0'
  };
  props.getCatalog && useEffect(function () {
    return checkCall(props.getCatalog, metadata.catalog);
  });
  return renderCascade(props.cascade, metadata, eitherObj(props.parent, {}));
};

export { Cascader, registerComponents, registerCustomFind };
