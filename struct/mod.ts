import { lexTokens } from "./lex.ts";
import { parseStruct as parseStructInternal } from "./parse.ts";

export function parseStruct(code: string) {
  const tokens = lexTokens(code);
  console.log(tokens);
  const structInfo = parseStructInternal(tokens);
  console.log(structInfo);
  return structInfo;
}
