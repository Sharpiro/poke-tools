import { AnalyzedStruct } from "./analyze.ts";

export function getUnpackedStruct(
  analyzedStruct: AnalyzedStruct,
  buffer: Uint8Array,
  ctx: { index: number } = { index: 0 },
) {
  const obj: any = {};
  for (const field of analyzedStruct.fields) {
    if (field.type.isPrimitive) {
      const byteSize = field.type.size / 8;
      if (field.arraySize === undefined) {
        const slice = buffer.slice(ctx.index, ctx.index + byteSize);
        const num = toNumberLE(slice);
        ctx.index += byteSize;
        obj[field.identifier] = num;
      } else {
        let numArray = [];
        for (let i = 0; i < field.arraySize; i++) {
          const slice = buffer.slice(ctx.index, ctx.index + byteSize);
          const num = toNumberLE(slice);
          numArray.push(num);
          ctx.index += byteSize;
        }
        obj[field.identifier] = numArray;
      }
    } else {
      const objField = getUnpackedStruct(field.type, buffer, ctx);
      obj[field.identifier] = objField;
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
