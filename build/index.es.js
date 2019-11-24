import React, { useEffect } from 'react';
import { isStr, isObj, get, deepMerge, isFunc, capitalize, isColl, checkCall, eitherObj, isArr } from 'jsutils';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
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

var buildCascadeProps = function buildCascadeProps(cascade, metadata, parent) {
  var inlineProps = get(cascade, ['1'], {});
  var identity = metadata.identity,
      catalog = metadata.catalog;
  var cascadeId = getCascadeId(cascade, inlineProps);
  var cascadeProps = !cascadeId ? inlineProps : deepMerge(get(parent, ['props', 'children', cascadeId]), catalog[cascadeId], inlineProps);
  cascadeProps.key = cascadeProps.key || cascadeProps.id || cascadeProps.pos || metadata.pos;
  return cascadeProps;
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
  var catalogProps = getCatalogProps(catalog, id);
  return isObj(catalogProps) && (catalogProps.altRender || catalogProps.render);
};

var Registry =
function () {
  function Registry() {
    _classCallCheck(this, Registry);
    _defineProperty(this, "components", {});
    _defineProperty(this, "cached", {});
  }
  _createClass(Registry, [{
    key: "register",
    value: function register(compList) {
      if (!isObj(compList)) return console.warn("Cascade register method only accepts an object as it's first argument!");
      this.components = _objectSpread2({}, this.components, {}, compList);
    }
  }, {
    key: "unset",
    value: function unset(key) {
      key ? delete this.components[key] : this.components = {};
    }
  }, {
    key: "get",
    value: function get(key) {
      return key && this.components[key] || this.components;
    }
  }, {
    key: "find",
    value: function find(cascade, props, catalog, parent) {
      var cascadeId = getCascadeId(cascade, props);
      var cascadeKey = cascadeId && getAltRender(catalog, cascadeId);
      var type = cascade[0];
      return this.components[cascadeKey] || this.components[capitalize(type)] || this.components[type] || this.components[cascadeId] || type;
    }
  }]);
  return Registry;
}();
var registry = new Registry();
var registerCustomFind = function registerCustomFind(customFind) {
  return isFunc(customFind) && (registry.customFind = customFind);
};
var registerComponents = function registerComponents() {
  return registry.register.apply(registry, arguments);
};
var findComponent = function findComponent() {
  return isFunc(registry.customFind) ? registry.customFind.apply(registry, arguments) : registry.find.apply(registry, arguments);
};
var getCached = function getCached(id) {
  return registry.cached[id];
};
var addCached = function addCached(id) {
  var comp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  registry.cached[id] = comp;
  return registry.cached[id];
};

var getRenderEl = function getRenderEl(cascade, metadata, props, parent) {
  var catalog = metadata.catalog;
  var FoundComp = findComponent(cascade, props, catalog, parent);
  if (props.id) {
    isFunc(FoundComp) && addCached(props.id, FoundComp);
    updateCatalogProps(eitherObj(catalog[props.id], {}), props, metadata);
  }
  return React.createElement(FoundComp, props, renderCascade(cascade[2], metadata, {
    cascade: cascade,
    parent: parent,
    props: props
  }));
};
var buildCascadeNode = function buildCascadeNode(cascade, metadata, parent) {
  if (!cascade || !cascade[0]) return null;
  var props = buildCascadeProps(cascade, metadata, parent) || {};
  return props.id && getCached(props.id) || getRenderEl(cascade, metadata, props, parent);
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
  : cascade[0] === 'CASCADE_LOADING' ? null : isArr(cascade)
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
  var metadata = {
    catalog: isObj(props.catalog) && props.catalog || {},
    styles: props.styles,
    pos: '0'
  };
  props.getCatalog && useEffect(function () {
    return checkCall(props.getCatalog, metadata.catalog);
  });
  return renderCascade(props.cascade, metadata, eitherObj(props.parent, {}));
};

export { Cascader, registerComponents, registerCustomFind };
