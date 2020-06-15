"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInterfaceName = exports.parseInterfaceName = exports.resetInterfaceMap = exports.findInterface = exports.buildInInterfaces = exports.genericInterfaceMap = exports.recursiveMap = exports.map = exports.shouldSkipGenerate = exports.parseInterface = void 0;
const utils_1 = require("../utils");
const lodash_1 = require("lodash");
const buildInInterfaces = {
    Map: {
        name: 'JavaMap',
        code: `
    export interface JavaMap<T,U>{
        [key:T]:U
    }
  `,
    },
    List: {
        name: 'JavaList',
        code: `
    export interface JavaList<T>{
        [index:number]:T
    }
  `,
    },
};
exports.buildInInterfaces = buildInInterfaces;
let map = {};
exports.map = map;
let genericInterfaceMap = {};
exports.genericInterfaceMap = genericInterfaceMap;
let recursiveMap = {};
exports.recursiveMap = recursiveMap;
const findInterface = (interfaceName) => genericInterfaceMap[interfaceName] ||
    map[interfaceName] ||
    recursiveMap[interfaceName];
exports.findInterface = findInterface;
const resetInterfaceMap = () => {
    exports.map = map = {};
    exports.genericInterfaceMap = genericInterfaceMap = {};
    exports.recursiveMap = recursiveMap = {};
};
exports.resetInterfaceMap = resetInterfaceMap;
const parseInterfaceName = (interfaceName) => {
    const res = [];
    const recursive = (name) => {
        if (!name)
            return;
        const index = name.search(/[«<\[]/g);
        const hasGeneric = index !== -1;
        const generic = hasGeneric ? name.slice(index + 1, name.length - 1) : '';
        res.push({
            interface: hasGeneric ? name.slice(0, index) : name,
            generic,
            hasGeneric,
        });
        recursive(generic);
    };
    recursive(interfaceName);
    return res;
};
exports.parseInterfaceName = parseInterfaceName;
const generateInterfaceName = (list) => list.reduceRight((acc, cur) => `${cur.interface}${acc ? `<${acc}>` : acc}`, '');
exports.generateInterfaceName = generateInterfaceName;
const parseProperties = (properties, requiredList) => {
    const res = {};
    Object.keys(properties).forEach((propertyKey) => {
        const schema = properties[propertyKey];
        const { imports, type } = utils_1.schemaToTsType(schema);
        res[propertyKey] = {
            type,
            imports,
            required: (requiredList === null || requiredList === void 0 ? void 0 : requiredList.includes(propertyKey)) || false,
            description: schema.description || '',
        };
    });
    return res;
};
const findGenericKey = (properties) => {
    const index = Object.keys(properties).findIndex((key) => {
        var _a;
        return properties[key].$ref ||
            (properties[key].type === 'array' && ((_a = properties[key].items) === null || _a === void 0 ? void 0 : _a.$ref));
    });
    return Object.keys(properties)[index];
};
const shouldSkipGenerate = (interfaceName) => {
    const res = parseInterfaceName(interfaceName);
    if (!res[0].hasGeneric) {
        return false;
    }
    return res.every((item) => map[item.interface] || recursiveMap[item.interface]);
};
exports.shouldSkipGenerate = shouldSkipGenerate;
const parseInterface = (definitions, interfaceName, recursive = false) => {
    const currentMap = recursive ? recursiveMap : map;
    const [item] = parseInterfaceName(interfaceName);
    if (utils_1.hasGeneric(item.generic)) {
        parseInterface(definitions, item.generic, true);
    }
    const parsedInterface = {
        name: item.hasGeneric ? `${item.interface}<T>` : item.interface,
        props: {},
        hasGeneric: item.hasGeneric,
        skipGenerate: Object.keys(buildInInterfaces).includes(item.interface),
    };
    if (parsedInterface.skipGenerate)
        return parsedInterface;
    const { properties, required } = definitions[interfaceName];
    if (!properties)
        return parsedInterface;
    if (parsedInterface.hasGeneric) {
        if (genericInterfaceMap[item.interface]) {
            parsedInterface.skipGenerate = true;
            return;
        }
        else {
            const genericKey = findGenericKey(properties);
            parsedInterface.props = genericKey
                ? Object.assign({ [genericKey]: {
                        type: properties[genericKey].type === 'array' ? 'T[]' : 'T',
                        imports: [],
                        required: (required === null || required === void 0 ? void 0 : required.includes(genericKey)) || false,
                        description: properties[genericKey].description || '',
                    } }, parseProperties(lodash_1.omit(properties, genericKey), required)) : parseProperties(properties, required);
            if (recursiveMap[item.interface]) {
                delete recursiveMap[item.interface];
            }
            if (map[item.interface]) {
                delete map[item.interface];
            }
            genericInterfaceMap[item.interface] = parsedInterface;
            return;
        }
    }
    parsedInterface.props = parseProperties(properties, required);
    currentMap[item.interface] = parsedInterface;
};
exports.parseInterface = parseInterface;
