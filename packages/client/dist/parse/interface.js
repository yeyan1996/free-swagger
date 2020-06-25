"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatGenericInterface = exports.flatInterfaceName = exports.resetInterfaceMap = exports.findInterface = exports.buildInInterfaces = exports.genericInterfaceMap = exports.recursiveMap = exports.map = exports.shouldSkipGenerate = exports.parseInterface = void 0;
const utils_1 = require("../utils");
const lodash_1 = require("lodash");
const buildInInterfaces = {
    Map: {
        name: 'JavaMap',
        code: `
   export type JavaMap<T, U> = Record<string, U>
  `,
    },
    List: {
        name: 'JavaList',
        code: `
   export type JavaList<T> = Array<T>
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
    const stack = [];
    let word = '';
    const isOpenCharacter = (character) => Object.keys(utils_1.SPECIAL_CHARACTERS_MAP_OPEN).includes(character);
    const isCloseCharacter = (character) => Object.keys(utils_1.SPECIAL_CHARACTERS_MAP_CLOSE).includes(character);
    for (const s of interfaceName.split('')) {
        if (isOpenCharacter(s)) {
            stack.push(word);
            word = '';
            stack.push(s);
        }
        else if (s === ',') {
            if (word) {
                stack.push(word);
                word = '';
            }
        }
        else if (isCloseCharacter(s)) {
            if (word) {
                stack.push(word);
                word = '';
            }
            let lasted;
            const generics = [];
            while (!isOpenCharacter(lasted) && stack.length > 0) {
                lasted = stack.pop();
                if (typeof lasted === 'string' && !isOpenCharacter(lasted)) {
                    generics.unshift({ name: lasted });
                }
                else {
                    if (!isOpenCharacter(lasted)) {
                        generics.unshift(lasted);
                    }
                }
            }
            if (stack.length) {
                const name = stack.pop();
                if (typeof name === 'string') {
                    stack.push({ name, generics });
                }
            }
            if (stack.length === 1)
                return stack[0];
        }
        else {
            word += s;
        }
    }
    return { name: word };
};
const flatInterfaceName = (interfaceName) => {
    const interfaceNames = [];
    utils_1.traverseTree(parseInterfaceName(interfaceName), (interfaceNameItem) => {
        interfaceNames.push(interfaceNameItem.name);
    });
    return interfaceNames;
};
exports.flatInterfaceName = flatInterfaceName;
const reduceInterfaceName = (tree) => {
    if (tree.generics) {
        return `${tree.name}<${tree.generics
            .map((child) => reduceInterfaceName(child))
            .join(',')}>`;
    }
    else {
        return tree.name;
    }
};
const formatGenericInterface = (interfaceName) => {
    const tree = parseInterfaceName(interfaceName);
    utils_1.traverseTree(tree, (interfaceItem) => {
        if (buildInInterfaces[interfaceItem.name]) {
            interfaceItem.name = buildInInterfaces[interfaceItem.name].name;
        }
        if (utils_1.TYPE_MAP[interfaceItem.name]) {
            interfaceItem.name = utils_1.TYPE_MAP[interfaceItem.name];
        }
    });
    return reduceInterfaceName(tree);
};
exports.formatGenericInterface = formatGenericInterface;
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
const shouldSkipGenerate = (interfaceName, noContext = false) => {
    var _a;
    const res = parseInterfaceName(interfaceName);
    if (!((_a = res.generics) === null || _a === void 0 ? void 0 : _a.length)) {
        return false;
    }
    if (noContext)
        return true;
    return flatInterfaceName(interfaceName).every((item) => utils_1.TYPE_MAP[item] || map[item] || recursiveMap[item]);
};
exports.shouldSkipGenerate = shouldSkipGenerate;
const parseInterface = (definitions, interfaceName, recursive = false) => {
    var _a, _b;
    const currentMap = recursive ? recursiveMap : map;
    const res = parseInterfaceName(interfaceName);
    const parsedInterface = {
        name: ((_a = res.generics) === null || _a === void 0 ? void 0 : _a.length) ? `${res.name}<T>` : res.name,
        props: {},
        hasGeneric: !!((_b = res.generics) === null || _b === void 0 ? void 0 : _b.length),
        skipGenerate: Object.keys(buildInInterfaces).includes(res.name),
    };
    if (parsedInterface.skipGenerate)
        return parsedInterface;
    const { properties, required } = definitions[interfaceName];
    if (!properties)
        return parsedInterface;
    if (parsedInterface.hasGeneric) {
        if (genericInterfaceMap[res.name]) {
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
            if (recursiveMap[res.name]) {
                delete recursiveMap[res.name];
            }
            if (map[res.name]) {
                delete map[res.name];
            }
            genericInterfaceMap[res.name] = parsedInterface;
            return;
        }
    }
    parsedInterface.props = parseProperties(properties, required);
    currentMap[res.name] = parsedInterface;
};
exports.parseInterface = parseInterface;
