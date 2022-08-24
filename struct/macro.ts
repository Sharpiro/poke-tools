import { lexTokens, removeWhitespace, Token } from "./lex.ts";
import { assertDefined, assertEqual } from "./tools.ts";

export function preProcess(
  source: string,
  tokens: Token[],
  defineVariables: Map<string, { name: string; value: string }>,
) {
  const sourceChars = [...source].map((c) => c);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const defineVariable = defineVariables.get(token.value);
    if (defineVariable) {
      insertValue(sourceChars, token, defineVariable.value);
    } else if (token.value === "#define") {
      const { start, end, defineName, defineValue } = getDefineMacro(
        tokens.slice(i),
      );
      defineVariables.set(defineName, { name: defineName, value: defineValue });
      fillWhitespace(sourceChars, start, end);
      i += 2;
    }
  }
  const processedSource = sourceChars.join("");
  return processedSource;
}

function insertValue(data: string[], variableToken: Token, value: string) {
  if (value.length > variableToken.value.length) {
    throw new Error("not implemented");
  }

  let j = 0;
  for (let i = variableToken.start; i < variableToken.end; i++) {
    const replacement = value[j++] ?? " ";
    data[i] = replacement;
  }
}

function fillWhitespace(data: string[], start: number, end: number) {
  for (let i = start; i < end; i++) {
    data[i] = " ";
  }
}

function getDefineMacro(tokens: Token[]) {
  const start = tokens.at(0)?.start;
  assertDefined(start);
  const defineName = tokens.at(1)?.value;
  assertDefined(defineName);
  const defineValueToken = tokens.at(2);
  assertDefined(defineValueToken);
  const end = defineValueToken.end;

  return { defineName, defineValue: defineValueToken.value, start, end };
}
