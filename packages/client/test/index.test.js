import freeSwaggerClient, {
  jsTemplate,
  tsTemplate,
  compileInterfaces
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
                lang: "ts"
            },
            "/api/services/app/YmTicketTypical/AddOrUpdateTicketTypical",
            "post"
        );
        expect(codeFragment).toMatchSnapshot();
    });

  test("generate full ts interface", () => {
    const codeFragment = compileInterfaces(require("./json/swaggerPetstore"));
    expect(codeFragment).toMatchSnapshot();
  });

    test("generate full ts interface with generic", () => {
        const codeFragment = compileInterfaces(require("./json/generic.json"));
        expect(codeFragment).toMatchSnapshot();
    });

    test("generate full ts interface with special generic", () => {
        const codeFragment = compileInterfaces(require("./json/uberApi.json"));
        expect(codeFragment).toMatchSnapshot();
    });


    test("generate ts interface snippet", () => {
    const codeFragment = compileInterfaces(
      require("./json/swaggerPetstore"),
      "Category"
    );
    expect(codeFragment).toMatchSnapshot();
  });

    test("generate ts interface snippet width generic", () => {
        const codeFragment = compileInterfaces(
            require("./json/generic.json"),
            "PageInfo«List«Qwe»»"
        );
        expect(codeFragment).toMatchSnapshot();
    });
});
