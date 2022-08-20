import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { analyze } from "./analyze.ts";
import { parseStruct } from "./mod.ts";

Deno.test("primitive types", () => {
  const tempStructRaw = `struct Temp
{
  bool a;
  u8 b;
  u16 c;
  u32 d;
};`;

  const tempStruct = parseStruct(tempStructRaw);
  const structSize = analyze([tempStruct]);
  assertEquals(structSize, 8);
});

// Deno.test("multiple structs", () => {
//   const tempStructRaw = `struct Temp
// {
//   bool a;
//   u8 b;
//   u16 c;
//   u32 d;
// };`;

//   const tempStruct = parseStruct(tempStructRaw);
//   const structSize = getStructSize(tempStruct);
//   assertEquals(structSize, 8);
// });
