"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasGeneric = exports.TYPE_MAP = exports.schemaToTsType = exports.isRef = exports.getRef = exports.formatGenericInterface = exports.formatCode = void 0;
const standalone_1 = __importDefault(require("prettier/standalone"));
const parser_typescript_1 = __importDefault(require("prettier/parser-typescript"));
const parser_babel_1 = __importDefault(require("prettier/parser-babel"));
const interface_1 = require("./parse/interface");
const SPECIAL_CHARACTERS_MAP = {
    '«': '<',
    '»': '>',
    '[': '<',
    ']': '>',
    '{': '<',
    '}': '>',
};
const SPECIAL_CHARACTERS_MAP_REG = new RegExp(`[${Object.keys(SPECIAL_CHARACTERS_MAP).join('\\')}]`, 'g');
const hasGeneric = (interfaceName) => SPECIAL_CHARACTERS_MAP_REG.test(interfaceName);
exports.hasGeneric = hasGeneric;
const TYPE_MAP = {
    boolean: 'boolean',
    bool: 'boolean',
    Boolean: 'boolean',
    Int64: 'number',
    integer: 'number',
    number: 'number',
    string: 'string',
    file: 'Blob',
    formData: 'FormData',
};
exports.TYPE_MAP = TYPE_MAP;
const formatGenericInterface = (definitionClassName) => interface_1.generateInterfaceName(interface_1.parseInterfaceName(definitionClassName.replace(SPECIAL_CHARACTERS_MAP_REG, ($0) => SPECIAL_CHARACTERS_MAP[$0])).map((item) => (Object.assign(Object.assign({}, item), { interface: interface_1.buildInInterfaces[item.interface]
        ? interface_1.buildInInterfaces[item.interface].name
        : item.interface }))));
exports.formatGenericInterface = formatGenericInterface;
const getRef = (ref) => {
    const propType = ref.slice(ref.lastIndexOf('/') + 1);
    return formatGenericInterface(propType);
};
exports.getRef = getRef;
const isRef = (schema) => schema && !!schema.$ref;
exports.isRef = isRef;
const schemaToTsType = (schema) => {
    if (!schema)
        return {
            type: 'any',
            imports: [],
            isBinary: false,
            required: false,
            description: '',
        };
    const imports = [];
    const recursive = (schema) => {
        if (schema.$ref) {
            const isWord = /^\w*$/;
            const originRef = getRef(schema.$ref);
            imports.push(...interface_1.parseInterfaceName(originRef)
                .map((item) => item.interface)
                .filter((item) => !Object.keys(TYPE_MAP).includes(item))
                .filter((item) => isWord.test(item))
                .map((item) => interface_1.buildInInterfaces[item] ? interface_1.buildInInterfaces[item].name : item));
            return originRef;
        }
        if (!schema.type)
            return 'any';
        if (schema.type === 'array' && schema.items) {
            return `${recursive(schema.items)}[]`;
        }
        if (schema.type === 'object') {
            let type = '';
            if (!schema.properties)
                return 'object';
            Object.keys(schema.properties).forEach((key) => {
                type += schema.properties ? recursive(schema.properties[key]) : '';
            });
            return type;
        }
        if (schema.enum) {
            return schema.enum.map((value) => `"${value}"`).join(' | ');
        }
        if (Array.isArray(schema.type)) {
            return JSON.stringify(schema.type);
        }
        return TYPE_MAP[schema.type];
    };
    return {
        type: recursive(schema),
        imports,
        isBinary: schema.type === 'file',
        required: false,
        description: '',
    };
};
exports.schemaToTsType = schemaToTsType;
const formatCode = (lang) => (code) => standalone_1.default.format(code, {
    plugins: [parser_babel_1.default, parser_typescript_1.default],
    printWidth: 120,
    tabWidth: 2,
    parser: lang === 'ts' ? 'typescript' : 'babel',
    trailingComma: 'none',
});
exports.formatCode = formatCode;
