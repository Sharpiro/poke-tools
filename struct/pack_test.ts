import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { getAnalyzedStruct } from "./analyze.ts";
import { lexTokens } from "./lex.ts";
import { getUnpackedStruct } from "./pack.ts";
import { parseStruct } from "./parse.ts";

Deno.test("u8 only", () => {
  const structRaw = `struct Temp
{
  u8 a;
  u8 b;
  u8 c;
};`;

  const tokens = lexTokens(structRaw);
  const parsedStruct = parseStruct(tokens);
  const analyzedStruct = getAnalyzedStruct(
    parsedStruct,
    new Map(),
    new Map(),
  );
  console.log(analyzedStruct);
  const unpacked = getUnpackedStruct(
    analyzedStruct,
    new Uint8Array([0, 15, 255]),
  );
  console.log(unpacked);
  assertEquals(unpacked.a, 0);
  assertEquals(unpacked.b, 15);
  assertEquals(unpacked.c, 255);
});

Deno.test("u16 only", () => {
  const structRaw = `struct Temp
{
  u16 a;
  u16 b;
  u16 c;
  u16 d;
};`;

  const tokens = lexTokens(structRaw);
  const parsedStruct = parseStruct(tokens);
  const analyzedStruct = getAnalyzedStruct(
    parsedStruct,
    new Map(),
    new Map(),
  );
  console.log(analyzedStruct);
  const unpacked = getUnpackedStruct(
    analyzedStruct,
    new Uint8Array([0, 0, 0x0f, 0, 0xff, 0x00, 0x0f, 0x0a]),
  );
  console.log(unpacked);
  assertEquals(unpacked.a, 0);
  assertEquals(unpacked.b, 0x0f);
  assertEquals(unpacked.c, 0xff);
  assertEquals(unpacked.d, 0x0a0f);
});

Deno.test("u32 only", () => {
  const structRaw = `struct Temp
{
  u32 a;
  u32 b;
  u32 c;
  u32 d;
  u32 e;
};`;

  const tokens = lexTokens(structRaw);
  const parsedStruct = parseStruct(tokens);
  const analyzedStruct = getAnalyzedStruct(
    parsedStruct,
    new Map(),
    new Map(),
  );
  console.log(analyzedStruct);
  const unpacked = getUnpackedStruct(
    analyzedStruct,
    new Uint8Array([
      0,
      0,
      0,
      0,
      0x0f,
      0,
      0,
      0,
      0xff,
      0,
      0,
      0,
      0x0f,
      0x0a,
      0,
      0,
      0x0f,
      0x0a,
      0x0a,
      0x0f,
    ]),
  );
  console.log(unpacked);
  assertEquals(unpacked.a, 0);
  assertEquals(unpacked.b, 0x0f);
  assertEquals(unpacked.c, 0xff);
  assertEquals(unpacked.d, 0x0a0f);
  assertEquals(unpacked.e, 0x0f0a0a0f);
});

Deno.test("primitives only", () => {
  const structRaw = `struct Temp
{
  u16 a;
  u8 b;
  u32 c;
};`;

  const tokens = lexTokens(structRaw);
  const parsedStruct = parseStruct(tokens);
  const analyzedStruct = getAnalyzedStruct(
    parsedStruct,
    new Map(),
    new Map(),
  );
  console.log(analyzedStruct);
  const unpacked = getUnpackedStruct(
    analyzedStruct,
    new Uint8Array([
      0x0f,
      0x0a,
      0x0f,
      0x0f,
      0x0a,
      0x0a,
      0x0f,
    ]),
  );
  console.log(unpacked);
  assertEquals(unpacked.a, 0x0a0f);
  assertEquals(unpacked.b, 0x0f);
  assertEquals(unpacked.c, 0x0f0a0a0f);
});

Deno.test("u8 array", () => {
  const structRaw = `struct Temp
{
  u8 a[5];
};`;

  const tokens = lexTokens(structRaw);
  const parsedStruct = parseStruct(tokens);
  const analyzedStruct = getAnalyzedStruct(
    parsedStruct,
    new Map(),
    new Map(),
  );
  console.log(analyzedStruct);
  const unpacked = getUnpackedStruct(
    analyzedStruct,
    new Uint8Array([0, 1, 2, 3, 4]),
  );
  console.log(unpacked);
  assertEquals(unpacked.a, [0, 1, 2, 3, 4]);
});

Deno.test("primitives and array", () => {
  const structRaw = `struct Temp
{
  u16 a;
  u16 b[5];
  u32 c;
};`;

  const tokens = lexTokens(structRaw);
  const parsedStruct = parseStruct(tokens);
  const analyzedStruct = getAnalyzedStruct(
    parsedStruct,
    new Map(),
    new Map(),
  );
  console.log(analyzedStruct);
  const unpacked = getUnpackedStruct(
    analyzedStruct,
    new Uint8Array([
      0x0f,
      0x0a,
      0x0f,
      0x01,
      0x0f,
      0x01,
      0x0f,
      0x01,
      0x0f,
      0x01,
      0x0f,
      0x01,
      0x0f,
      0x0a,
      0x0a,
      0x0f,
    ]),
  );
  console.log(unpacked);
  assertEquals(unpacked.a, 0x0a0f);
  assertEquals(unpacked.b, [0x010f, 0x010f, 0x010f, 0x010f, 0x010f]);
  assertEquals(unpacked.c, 0x0f0a0a0f);
});
