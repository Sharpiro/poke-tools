import { parseStruct } from "./mod.ts";

// u8 f : 4;
// u8 g : 4;
// u32 e[5];

// const tokens = lexTokens(testStruct);
// console.log(tokens);
// const structInfo = parseStruct(tokens);
// console.log(structInfo);

Deno.test("primitive types", () => {
  const testStruct = `struct Temp
{
  bool a;
  u8 b;
  u16 c;
  u32 d;
};`;

  const _result = parseStruct(testStruct);
});

Deno.test("array", () => {
  const testStruct = `struct Temp
{
  u8 a[50];
};`;

  const _result = parseStruct(testStruct);
});

Deno.test("array size const var", () => {
  const testStruct = `struct Temp
{
  u8 b[SIZE];
};`;

  const _result = parseStruct(testStruct);
});

Deno.test("primitive and array", () => {
  const testStruct = `struct Temp
{
  bool a;
  u8 b[50];
  u16 c;
};`;

  const _result = parseStruct(testStruct);
});

Deno.test("sector struct", () => {
  const testStruct = `struct Sector
{
  u8 data[SECTOR_DATA_SIZE];
  u8 unused[SECTOR_UNUSED];
  u16 id;
  u16 checksum;
  u32 signature;
  u32 counter;
};`;

  const _result = parseStruct(
    testStruct,
    new Map([
      ["SECTOR_DATA_SIZE", 5],
      ["SECTOR_UNUSED", 10],
    ])
  );
});

// Deno.test("multiple structs", () => {
//   const tempStruct = `struct Temp
// {
//   u8 a;
// };`;

//   const ownerStruct = `struct Owner
// {
//   Temp temp;
// };`;

//   const tempStructParsed = parseStruct(tempStruct);
//   const ownerStructParsed = parseStruct(ownerStruct);
// });
