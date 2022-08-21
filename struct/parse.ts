function assertDefined(condition: any): asserts condition {
  if (!condition) {
    throw new Error();
  }
}

function assertEqual(actual: any, expected: any): asserts actual {
  if (actual !== expected) {
    throw new Error(`'${actual}' !== '${expected}'`);
  }
}

function parseField(tokens: string[]) {
  const type = nextToken(tokens);
  assertDefined(type);

  const identifier = nextToken(tokens);
  assertDefined(identifier);

  const peek = peekToken(tokens);
  let arraySize: string | undefined;
  if (peek === ";") {
    assertEqual(nextToken(tokens), ";");
  } else {
    assertEqual(nextToken(tokens), "[");
    arraySize = nextToken(tokens);
    assertDefined(arraySize);
    assertEqual(nextToken(tokens), "]");
    assertEqual(nextToken(tokens), ";");
  }
  return { type, identifier, arraySize };
}

function parseStructBody(tokens: string[]) {
  assertEqual(nextToken(tokens), "{");

  const fields = [];
  while (peekToken(tokens) !== "}") {
    const field = parseField(tokens);
    fields.push(field);
  }
  assertEqual(nextToken(tokens), "}");

  return fields;
}

function nextToken(tokens: string[]) {
  return tokens.shift();
}

function peekToken(tokens: string[]) {
  return tokens.at(0);
}

export function parseStruct(tokens: string[]): ParsedStruct {
  const type = nextToken(tokens);
  assertEqual(type, "struct");

  let identifier = nextToken(tokens);
  assertDefined(identifier);

  const fields = parseStructBody(tokens);
  assertEqual(nextToken(tokens), ";");

  return { identifier, fields };
}

export function parseStructs(tokens: string[]) {
  const structs = [];

  while (peekToken(tokens) === "struct") {
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
