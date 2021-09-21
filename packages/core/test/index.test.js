import freeSwaggerCore, {
    jsTemplate,
    tsTemplate,
    compileInterfaces,
    compileJsDocTypedefs
} from "../src/main";

describe("core test", () => {
    beforeAll(() => {
        Date.now = jest.fn(() => 1482363367071);
    });

    test("code fragment", async () => {
        const codeFragment = await freeSwaggerCore(
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

    test("code fragment2", async () => {
        const codeFragment = await freeSwaggerCore(
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

    test("code fragment with js doc", async () => {
        const codeFragment = await freeSwaggerCore(
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

    test("code fragment with js doc and typedef", async () => {
        const codeFragment = await freeSwaggerCore(
            {
                source: require("./json/swaggerPetstore"),
                templateFunction: eval(jsTemplate),
                lang: "js",
                jsDoc: true,
                typedef: true
            },
            "/user/{username}/{qqq}",
            "put"
        );
        expect(codeFragment).toMatchSnapshot();
    });

    test("code fragment with js doc and recursive typedef", async () => {
        const codeFragment = await freeSwaggerCore(
            {
                source: require("./json/swaggerPetstore"),
                templateFunction: eval(jsTemplate),
                lang: "js",
                jsDoc: true,
                typedef: true,
                recursive: true
            },
            "/user/{username}/{qqq}",
            "put"
        );
        expect(codeFragment).toMatchSnapshot();
    });

    test("ts code fragment with get method", async () => {
        const codeFragment = await freeSwaggerCore(
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

    test("ts code fragment with post method", async () => {
        const codeFragment = await freeSwaggerCore(
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

    test("ts code fragment with interface", async () => {
        const codeFragment = await freeSwaggerCore(
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

    test("ts code fragment with recursive interface", async () => {
        const codeFragment = await freeSwaggerCore(
            {
                source: require("./json/generic.json"),
                templateFunction: eval(tsTemplate),
                lang: "ts",
                interface: true,
                recursive: true
            },
            "/companies",
            "get"
        );
        expect(codeFragment).toMatchSnapshot();
    });

    test("ts code fragment with generic", async () => {
        const codeFragment = await freeSwaggerCore(
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


    test("ts code fragment with special generic", async () => {
        const codeFragment = await freeSwaggerCore(
            {
                source: require("./json/uberApi.json"),
                templateFunction: eval(tsTemplate),
                lang: "ts",
                interface: true,
                recursive: true
            },
            "/api/services/app/YmTicketTypical/AddOrUpdateTicketTypical",
            "post"
        );
        expect(codeFragment).toMatchSnapshot();
    });

    test("generate full js doc", async () => {
        const {code: codeFragment} = await compileJsDocTypedefs({source: require("./json/swaggerPetstore")});
        expect(codeFragment).toMatchSnapshot();
    });


    test("generate full ts interface", async () => {
        const {code: codeFragment} = await compileInterfaces({source: require("./json/swaggerPetstore")});
        expect(codeFragment).toMatchSnapshot();
    });

    test("generate full ts interface with generic", async () => {
        const {code: codeFragment} = await compileInterfaces({source: require("./json/generic.json")});
        expect(codeFragment).toMatchSnapshot();
    });

    test("generate full ts interface with special generic", async () => {
        const {code: codeFragment} = await compileInterfaces({source: require("./json/uberApi.json")});
        expect(codeFragment).toMatchSnapshot();
    });


    test("generate ts interface snippet", async () => {
        const {code: codeFragment} = await compileInterfaces(
            {
                source: require("./json/swaggerPetstore"),
                interfaceName: "Category"
            }
        );
        expect(codeFragment).toMatchSnapshot();
    });

    test("generate ts interface snippet width generic", async () => {
        const {code: codeFragment} = await compileInterfaces(
            {
                source: require("./json/generic.json"),
                interfaceName: "PageInfo«List«Qwe»»"
            }
        );
        expect(codeFragment).toMatchSnapshot();
    });
});
