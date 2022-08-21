import { AnalyzedStruct } from "./analyze.ts";

export function getPackedStruct(analyzedStruct: AnalyzedStruct) {
  const buffer = new Uint8Array(100);
  for (const field of analyzedStruct.fields) {
    //
  }
}

export function getUnpackedStruct(
  analyzedStruct: AnalyzedStruct,
  buffer: Uint8Array,
) {
  const obj: any = {};
  let index = 0;
  for (const field of analyzedStruct.fields) {
    if (field.type.isPrimitive) {
      const byteSize = field.type.size / 8;
      if (field.arraySize === undefined) {
        const slice = buffer.slice(index, index + byteSize);
        const num = toNumberLE(slice);
        index += byteSize;
        obj[field.identifier] = num;
      } else {
        let numArray = [];
        for (let i = 0; i < field.arraySize; i++) {
          const slice = buffer.slice(index, index + byteSize);
          const num = toNumberLE(slice);
          numArray.push(num);
          index += byteSize;
        }
        obj[field.identifier] = numArray;
      }
    } else {
      const structType = field.type;
      throw new Error("not implemented");
    }
  }
  return obj;
}

function toNumberLE(buffer: Uint8Array) {
  let x = 0;
  for (let i = 0; i < buffer.length; i++) {
    const byte = buffer[i];
    const byteShifted = byte << (i * 8);
    x |= byteShifted;
  }
  return x;
}
