import { describe, it, expect } from "bun:test";
import { parseOutput } from "./typescript";

describe("TypeScript", () => {
  it("should properly parse output", async () => {
    const stdout = `test.ts(1,19): error TS2355: A function whose declared type is neither 'undefined', 'void', nor 'any' must return a value.
test.ts(5,24): error TS7006: Parameter 'a' implicitly has an 'any' type.
`;
    const stderr = "";
    const code = 1;

    expect(parseOutput({ code, stdout, stderr })).toEqual([
      {
        file: "test.ts",
        message:
          "A function whose declared type is neither 'undefined', 'void', nor 'any' must return a value.",
        kind: "error",
        location: {
          line: 1,
          column: 19,
        },
        rule: "TS2355",
      },
      {
        file: "test.ts",
        message: "Parameter 'a' implicitly has an 'any' type.",
        kind: "error",
        location: {
          line: 5,
          column: 24,
        },
        rule: "TS7006",
      },
    ]);
  });

  it("should parse vue-tsc output", () => {
    const stdout = `src/components/CustomListsPref.vue(46,6): error TS2345: Argument of type '{ vale: string; }' is not assignable to parameter of type 'Partial<{}> & Omit<{ readonly value: string; "onUpdate:value"?: ((newValue: string) => any) | undefined; } & VNodeProps & AllowedComponentProps & ComponentCustomProps & Readonly<...> & { ...; }, never> & Record<...>'.
      Property 'value' is missing in type '{ vale: string; }' but required in type 'Omit<{ readonly value: string; "onUpdate:value"?: ((newValue: string) => any) | undefined; } & VNodeProps & AllowedComponentProps & ComponentCustomProps & Readonly<...> & { ...; }, never>'.`;
    const stderr = "";
    const code = 1;

    expect(parseOutput({ code, stdout, stderr })).toEqual([
      {
        file: "src/components/CustomListsPref.vue",
        message:
          "Argument of type '{ vale: string; }' is not assignable to parameter of type 'Partial<{}> & Omit<{ readonly value: string; \"onUpdate:value\"?: ((newValue: string) => any) | undefined; } & VNodeProps & AllowedComponentProps & ComponentCustomProps & Readonly<...> & { ...; }, never> & Record<...>'.",
        kind: "error",
        location: {
          line: 46,
          column: 6,
        },
        rule: "TS2345",
      },
    ]);
  });
});
