import React from 'react';
import { isStr, isObj, get, softFalsy, deepMerge, isFunc, capitalize, isColl, eitherObj, isArr } from 'jsutils';

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

var getIdentityId = function getIdentityId(cascade) {
  var identity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var parent = arguments.length > 2 ? arguments[2] : undefined;
  if (!isObj(parent) || !isObj(cascade)) return;
  var props = parent.props,
      parentCascade = parent.cascade,
      CASCADE_ROOT = parent.CASCADE_ROOT;
  var parentPos = get(props, ['pos']);
  if (!isObj(parentCascade) || !isStr(parentPos)) return !CASCADE_ROOT && console.warn("Parent cascade does not exist!", parent, cascade);
  var pos = parentCascade[2].indexOf(cascade);
  return softFalsy(pos) ? identity["".concat(parentPos, ".2.").concat(pos)] : console.warn("Cascade node pos not found!", parent, cascade);
};
var buildCascadeProps = function buildCascadeProps(cascade, metadata, parent) {
  var inlineProps = get(cascade, ['1'], {});
  var identity = metadata.identity,
      catalog = metadata.catalog;
  var cascadeId = findCascadeId(cascade, inlineProps, identity, parent);
  var cascadeProps = !cascadeId ? inlineProps : deepMerge(get(parent, ['props', 'children', cascadeId]), catalog[cascadeId], inlineProps);
  cascadeProps.key = cascadeProps.key || cascadeProps.id || cascadeProps.pos || metadata.pos;
  return cascadeProps;
};
var getCascadeId = function getCascadeId(cascade, props, id) {
  return isStr(id) && id || isObj(cascade) && (get(cascade, ['1', 'id']) || !props && get(cascade, ['id'])) || get(props, ['id']);
};
var findCascadeId = function findCascadeId(cascade, props, identity, parent) {
  return getCascadeId(cascade, props) || isObj(identity) && getIdentityId(cascade, identity, parent);
};

var getCatalogProps = function getCatalogProps(catalog, id) {
  return !isObj(catalog) || !isStr(id) ? console.warn("getCatalogProps requires a catalog object, and an id!", catalog, id) : catalog[id];
};
var getAltRender = function getAltRender(catalog, id) {
  var catalogProps = getCatalogProps(catalog, id);
  return isObj(catalogProps) && (catalogProps.altRender || catalogProps.render);
};

var components = {};
var Registry =
function () {
  function Registry() {
    _classCallCheck(this, Registry);
  }
  _createClass(Registry, [{
    key: "register",
    value: function register(compList) {
      if (!isObj(compList)) return console.warn("Cascade register method only accepts an object as it's first argument!");
      components = _objectSpread2({}, components, {}, compList);
    }
  }, {
    key: "unset",
    value: function unset(key) {
      key ? delete components[key] : components = {};
    }
  }, {
    key: "get",
    value: function get(key) {
      return key && components[key] || components;
    }
  }, {
    key: "find",
    value: function find(cascade, props, catalog, identity, parent) {
      var cascadeId = !isObj(identity) || !isObj(parent) ? getCascadeId(cascade, props) : findCascadeId(cascade, props, identity, parent);
      var cascadeKey = cascadeId && getAltRender(catalog, cascadeId);
      var type = cascade[0];
      return components[cascadeKey] || components[capitalize(type)] || components[type] || components[cascadeId] || type;
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

var getRenderEl = function getRenderEl(cascade, metadata, props, parent) {
  var catalog = metadata.catalog,
      identity = metadata.identity;
  return React.createElement(findComponent(cascade, props, catalog, identity, parent), props, renderCascade(cascade[2], metadata, {
    cascade: cascade,
    parent: parent,
    props: props
  }));
};
var renderCascade = function renderCascade(cascade, metadata, parent) {
  if (!isColl(cascade)) return cascade;
  if (cascade[0] === 'CASCADE_LOADING') return null;
  return isArr(cascade) ? cascade.map(function (child, index) {
    return renderCascade(child, _objectSpread2({}, metadata, {
      pos: "".concat(metadata.pos, ".2.").concat(index)
    }), parent);
  }) : cascade[0] && getRenderEl(cascade, metadata, buildCascadeProps(cascade, metadata, parent), parent) || null;
};
var Cascader = function Cascader(props) {
  if (!isObj(props) || !isColl(props.cascade)) {
    console.warn("Cascader requires a cascade object as a prop!", props);
    return null;
  }
  return renderCascade(props.cascade, {
    catalog: eitherObj(props.catalog, {}),
    styles: props.styles,
    identity: props.identity,
    pos: 0
  }, _objectSpread2({}, eitherObj(props.parent, {}), {
    CASCADE_ROOT: true
  }));
};

export { Cascader, registerComponents, registerCustomFind };
