import { lexTokens } from "./lex.ts";
import { preProcess } from "./macro.ts";
import { parseStruct, parseStructs } from "./parse.ts";

Deno.test("primitive types", () => {
  const structRaw = `struct Temp
{
  bool a;
  u8 b;
  u16 c;
  u32 d;
};`;

  const tokens = lexTokens(structRaw);
  const _result = parseStruct(tokens);
});

Deno.test("array", () => {
  const structRaw = `struct Temp
{
  u8 a[50];
};`;

  const tokens = lexTokens(structRaw);
  const _result = parseStruct(tokens);
});

Deno.test("array size const var", () => {
  const structRaw = `struct Temp
{
  u8 b[SIZE];
};`;

  const tokens = lexTokens(structRaw);
  const _result = parseStruct(tokens);
});

Deno.test("primitive and array", () => {
  const structRaw = `struct Temp
{
  bool a;
  u8 b[50];
  u16 c;
};`;

  const tokens = lexTokens(structRaw);
  const _result = parseStruct(tokens);
});

Deno.test("sector struct", () => {
  const structRaw = `struct Sector
{
  u8 data[SECTOR_DATA_SIZE];
  u8 unused[SECTOR_UNUSED];
  u16 id;
  u16 checksum;
  u32 signature;
  u32 counter;
};`;

  const tokens = lexTokens(structRaw);
  const _result = parseStruct(tokens);
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

struct C_Container
{
  struct Temp temp;
};
`;

  const tokens = lexTokens(structsRaw);
  const parsedStructs = parseStructs(tokens);
  console.log(parsedStructs);
});

Deno.test("ignore comments", () => {
  const structsRaw = `
struct Temp
{
  // bool a;
  // int a;
  bool a;
  z a;
};
`;

  const tokens = lexTokens(structsRaw);
  console.log(tokens);
});

Deno.test("define macro", () => {
  // const source = `#define ARRAY_SIZE 9`;
  const source = `
  #define ARRAY_SIZE 9
  // #define FAV_NUMBER 8

  struct Temp
  {
    // bool a;
    // int a;
    bool a[ARRAY_SIZE];
  };
  `;

  const macroSource = preProcess(source);
  console.log(macroSource);
  // const tokens = lexTokens(macroSource);
  // console.log(tokens);
});
