import { lexTokens } from "./lex.ts";
import { parseStruct, parseStructs } from "./parse.ts";
import { AnalyzedStruct, analyzeStruct, analyzeStructs } from "./analyze.ts";
import { getUnpackedStruct } from "./pack.ts";
import { preProcess } from "./macro.ts";

// export { analyzeStruct, lexTokens, parseStruct };

// export { lexTokens } from "./lex.ts";
// export { parseStruct, parseStructs } from "./parse.ts";
// export { analyzeStruct, analyzeStructs } from "./analyze.ts";

export function getStructs(source: string, buffer: Uint8Array) {
  const preTokens = lexTokens(source);
  const processedSource = preProcess(source, preTokens, new Map());
  const tokens = lexTokens(processedSource);
  const parsedStructs = parseStructs(tokens);
  const analyzedStructs = analyzeStructs(parsedStructs, new Map());
  return analyzedStructs;
}

export function unpack(analyzedStruct: AnalyzedStruct, buffer: Uint8Array) {
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
