import { lexTokens } from "./lex.ts";
import { preProcess } from "./macro.ts";

Deno.test("single line struct", () => {
  const structRaw = `struct Temp { u8 a; };`;

  const tokens = lexTokens(structRaw);
  console.log(tokens);
});

Deno.test("struct ends with whitespace", () => {
  const structRaw = `struct
Temp
{
  u8 a; 
};
`;

  const tokens = lexTokens(structRaw);
  console.log(tokens);
});

Deno.test("define macro declaration", () => {
  // const source = `#define ARRAY_SIZE 9`;
  const source = `
  #define ARRAY_SIZE 9
  // #define FAV_NUMBER 8
  #define TEMP 1
  `;

  const tokens = lexTokens(source);
  const macroSource = preProcess(source, tokens, new Map());
  // console.log(macroSource);
  // const tokens = lexTokens(macroSource);
  console.log(tokens);
  console.log(macroSource);
});

Deno.test("define macro", () => {
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

  const tokens = lexTokens(source);
  const macroSource = preProcess(source, tokens, new Map());
  // console.log(macroSource);
  // const tokens = lexTokens(macroSource);
  console.log(macroSource);
});
