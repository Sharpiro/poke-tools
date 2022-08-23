import { lexTokens } from "./lex.ts";
import { parseStruct, parseStructs } from "./parse.ts";
import { analyzeStruct } from "./analyze.ts";
import { getUnpackedStruct } from "./pack.ts";

// export { analyzeStruct, lexTokens, parseStruct };

// export { lexTokens } from "./lex.ts";
// export { parseStruct, parseStructs } from "./parse.ts";
// export { analyzeStruct, analyzeStructs } from "./analyze.ts";

export function doAll(source: string, buffer: Uint8Array) {
  const tokens = lexTokens(source);
  const parsedStruct = parseStruct(tokens);
  const analyzedStruct = analyzeStruct(parsedStruct, new Map(), new Map());
  const unpackedStruct = getUnpackedStruct(analyzedStruct, buffer);
  return unpackedStruct;
}

// export function parseStruct(code: string, constants?: Map<string, number>) {
//   const tokens = lexTokens(code);
//   // console.log(tokens);
//   constants = constants ?? new Map<string, number>();
//   const structInfo = parseStructInternal({ tokens: tokens.slice(), constants });
//   // console.log(structInfo);
//   return structInfo;
// }

// export function parseStructs(code: string, constants?: Map<string, number>) {
//   const tokens = lexTokens(code);
//   // console.log(tokens);
//   constants = constants ?? new Map<string, number>();
//   const structInfo = parseStructsInternal({
//     tokens: tokens.slice(),
//     constants,
//   });
//   console.log(structInfo);
//   return structInfo;
// }
