import { Token } from "./lex.ts";
import { assertDefined, assertEqual } from "./tools.ts";

function parseField(tokens: Token[]) {
  const typeOrStructKeyword = nextToken(tokens)?.value;
  const type = typeOrStructKeyword === "struct"
    ? nextToken(tokens)?.value
    : typeOrStructKeyword;
  assertDefined(type);

  const identifier = nextToken(tokens)?.value;
  assertDefined(identifier);

  const peek = peekToken(tokens)?.value;
  let arraySize: string | undefined;
  if (peek === ";") {
    assertEqual(nextToken(tokens)?.value, ";");
  } else {
    assertEqual(nextToken(tokens)?.value, "[");
    arraySize = nextToken(tokens)?.value;
    assertDefined(arraySize);
    assertEqual(nextToken(tokens)?.value, "]");
    assertEqual(nextToken(tokens)?.value, ";");
  }
  return { type, identifier, arraySize };
}

function parseStructBody(tokens: Token[]) {
  assertEqual(nextToken(tokens)?.value, "{");

  const fields = [];
  while (peekToken(tokens)?.value !== "}") {
    const field = parseField(tokens);
    fields.push(field);
  }
  assertEqual(nextToken(tokens)?.value, "}");

  return fields;
}

function nextToken(tokens: Token[]) {
  return tokens.shift();
}

function peekToken(tokens: Token[]) {
  return tokens.at(0);
}

export function parseStruct(tokens: Token[]): ParsedStruct {
  const type = nextToken(tokens);
  assertEqual(type?.value, "struct");

  let identifier = nextToken(tokens)?.value;
  assertDefined(identifier);

  const fields = parseStructBody(tokens);
  assertEqual(nextToken(tokens)?.value, ";");

  return { identifier, fields };
}

export function parseStructs(tokens: Token[]) {
  const structs = [];

  while (peekToken(tokens)?.value === "struct") {
    const struct = parseStruct(tokens);
    structs.push(struct);
  }
  return structs;
}

export type ParseContext = {
  tokens: string[];
  constants: Map<string, number>;
};

export type ParsedStruct = {
  identifier: string;
  fields: {
    type: string;
    identifier: string;
    arraySize: string | undefined;
  }[];
};
