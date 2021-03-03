import freeSwaggerClient, {
    jsTemplate,
    tsTemplate,
    compileInterfaces,
    compileJsDocTypedefs
} from "../src/main";

describe("freeSwaggerClient", () => {
    test("code fragment", () => {
        const codeFragment = freeSwaggerClient(
            {
                source: require("./json/swaggerPetstore"),
                templateFunction: eval(jsTemplate),
                lang: "js"
            },
            "/pet/{petId}",
            "get"
        );
        expect(codeFragment).toMatchSnapshot();
    });

    test("code fragment2", () => {
        const codeFragment = freeSwaggerClient(
            {
                source: require("./json/swaggerPetstore"),
                templateFunction: eval(jsTemplate),
                lang: "js"
            },
            "/pet",
            "post"
        );
        expect(codeFragment).toMatchSnapshot();
    });

    test("code fragment with js doc", () => {
        const codeFragment = freeSwaggerClient(
            {
                source: require("./json/swaggerPetstore"),
                templateFunction: eval(jsTemplate),
                lang: "js",
                jsDoc: true,
            },
            "/user/{username}/{qqq}",
            "put"
        );
        expect(codeFragment).toMatchSnapshot();
    });

    test("code fragment with js doc and typedef", () => {
        const codeFragment = freeSwaggerClient(
            {
                source: require("./json/swaggerPetstore"),
                templateFunction: eval(jsTemplate),
                lang: "js",
                jsDoc: true,
                typedef:true
            },
            "/user/{username}/{qqq}",
            "put"
        );
        expect(codeFragment).toMatchSnapshot();
    });

    test("code fragment with js doc and recursive typedef", () => {
        const codeFragment = freeSwaggerClient(
            {
                source: require("./json/swaggerPetstore"),
                templateFunction: eval(jsTemplate),
                lang: "js",
                jsDoc: true,
                typedef:true,
                recursive:true
            },
            "/user/{username}/{qqq}",
            "put"
        );
        expect(codeFragment).toMatchSnapshot();
    });

    test("ts code fragment with get method", () => {
        const codeFragment = freeSwaggerClient(
            {
                source: require("./json/swaggerPetstore"),
                templateFunction: eval(tsTemplate),
                lang: "ts"
            },
            "/pet/{petId}",
            "get"
        );
        expect(codeFragment).toMatchSnapshot();
    });

    test("ts code fragment with post method", () => {
        const codeFragment = freeSwaggerClient(
            {
                source: require("./json/swaggerPetstore"),
                templateFunction: eval(tsTemplate),
                lang: "ts"
            },
            "/pet/{petId}/uploadImage",
            "post"
        );
        expect(codeFragment).toMatchSnapshot();
    });

    test("ts code fragment with interface", () => {
        const codeFragment = freeSwaggerClient(
            {
                source: require("./json/generic.json"),
                templateFunction: eval(tsTemplate),
                lang: "ts",
                interface: true,
            },
            "/companies",
            "get"
        );
        expect(codeFragment).toMatchSnapshot();
    });

    test("ts code fragment with recursive interface", () => {
        const codeFragment = freeSwaggerClient(
            {
                source: require("./json/generic.json"),
                templateFunction: eval(tsTemplate),
                lang: "ts",
                interface: true,
                recursive:true
            },
            "/companies",
            "get"
        );
        expect(codeFragment).toMatchSnapshot();
    });

    test("ts code fragment with generic", () => {
        const codeFragment = freeSwaggerClient(
            {
                source: require("./json/generic.json"),
                templateFunction: eval(tsTemplate),
                lang: "ts"
            },
            "/companies",
            "get"
        );
        expect(codeFragment).toMatchSnapshot();
    });


    test("ts code fragment with special generic", () => {
        const codeFragment = freeSwaggerClient(
            {
                source: require("./json/uberApi.json"),
                templateFunction: eval(tsTemplate),
                lang: "ts",
                interface: true,
                recursive:true
            },
            "/api/services/app/YmTicketTypical/AddOrUpdateTicketTypical",
            "post"
        );
        expect(codeFragment).toMatchSnapshot();
    });

    test("generate full js doc", () => {
        const {code:codeFragment} = compileJsDocTypedefs({source: require("./json/swaggerPetstore")});
        expect(codeFragment).toMatchSnapshot();
    });


    test("generate full ts interface", () => {
        const {code:codeFragment} = compileInterfaces({source: require("./json/swaggerPetstore")});
        expect(codeFragment).toMatchSnapshot();
    });

    test("generate full ts interface with generic", () => {
        const {code:codeFragment} = compileInterfaces({source: require("./json/generic.json")});
        expect(codeFragment).toMatchSnapshot();
    });

    test("generate full ts interface with special generic", () => {
        const {code:codeFragment} = compileInterfaces({source: require("./json/uberApi.json")});
        expect(codeFragment).toMatchSnapshot();
    });


    test("generate ts interface snippet", () => {
        const {code:codeFragment} = compileInterfaces(
            {
                source: require("./json/swaggerPetstore"),
                interfaceName: "Category"
            }
        );
        expect(codeFragment).toMatchSnapshot();
    });

    test("generate ts interface snippet width generic", () => {
        const {code:codeFragment} = compileInterfaces(
            {
                source: require("./json/generic.json"),
                interfaceName: "PageInfo«List«Qwe»»"
            }
        );
        expect(codeFragment).toMatchSnapshot();
    });
});
