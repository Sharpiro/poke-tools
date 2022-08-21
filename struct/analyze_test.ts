import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { getAnalyzedStruct, getAnalyzedStructs } from "./analyze.ts";
import { lexTokens } from "./lex.ts";
import { parseStruct, parseStructs } from "./parse.ts";

Deno.test("builtin types", () => {
  const structRaw = `struct Temp
{
  u8 z[1];
  u8 y[2];
  u8 x[X_SIZE];
  bool a;
  u8 b;
  u16 c;
  u32 d;
};`;

  const tokens = lexTokens(structRaw);
  const parsedStruct = parseStruct(tokens);
  const analyzedStruct = getAnalyzedStruct(
    parsedStruct,
    new Map([["X_SIZE", 99]]),
    new Map(),
  );
  console.log(analyzedStruct);
  // assertEquals(structSize, 8);
});

Deno.test("multiple structs", () => {
  const structsRaw = `
struct Temp
{
  bool a;
};

struct Container
{
  Temp temp;
};
`;

  const tokens = lexTokens(structsRaw);
  const parsedStructs = parseStructs(tokens);
  const analyzedStructs = getAnalyzedStructs(parsedStructs, new Map());
  console.log(analyzedStructs);
});
