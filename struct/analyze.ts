import { StructInfo } from "./parse.ts";

const primitives = new Map([
  ["bool", 8],
  ["u8", 8],
  ["u16", 16],
  ["u32", 32],
]);

export function analyze(structInfoList: StructInfo[]) {
  //
}

export function getStructInfo(structInfo: StructInfo) {
  let structBitSize = 0;
  for (const field of structInfo.fields) {
    const typeSize = primitives.get(field.type);
    if (typeSize === undefined) {
      throw new Error(`invalid type: '${field.type}'`);
    }
    structBitSize += typeSize;
  }

  const structByteSize = structBitSize / 8;
  return { structByteSize };
}
