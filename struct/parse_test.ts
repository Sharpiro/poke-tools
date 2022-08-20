import { parseStruct } from "./mod.ts";

const testStruct = `struct Temp
{
  bool a;
  u8 b;
  u16 c;
  u32 d;
};`;

// u8 f : 4;
// u8 g : 4;
// u32 e[5];

// const tokens = lexTokens(testStruct);
// console.log(tokens);
// const structInfo = parseStruct(tokens);
// console.log(structInfo);
const result = parseStruct(testStruct);
console.log(result);
