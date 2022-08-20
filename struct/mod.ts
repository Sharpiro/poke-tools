import { lexTokens } from "./lex.ts";
import {
  parseStruct as parseStructInternal,
  parseStructs as parseStructsInternal,
} from "./parse.ts";

export function parseStruct(code: string, constants?: Map<string, number>) {
  const tokens = lexTokens(code);
  // console.log(tokens);
  constants = constants ?? new Map<string, number>();
  const structInfo = parseStructInternal({ tokens: tokens.slice(), constants });
  console.log(structInfo);
  return structInfo;
}

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
