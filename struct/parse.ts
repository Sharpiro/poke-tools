function assertDefined(condition: any): asserts condition {
  if (!condition) {
    throw new Error();
  }
}

// function assertNumber(num: number) {
//   if (isNaN(num)) {
//     throw new Error("invalid number");
//   }
// }

function assertEqual(actual: any, expected: any): asserts actual {
  if (actual !== expected) {
    throw new Error(`'${actual}' !== '${expected}'`);
  }
}

function parseField(context: ParseContext) {
  const { tokens, constants } = context;
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
    // const arraySizeToken = nextToken(tokens);
    // const constantValue = constants.get(arraySizeToken);
    // if (constantValue !== undefined) {
    //   arraySize = constantValue;
    // } else {
    //   arraySize = Number(arraySizeToken);
    // }
    // if (isNaN(arraySize)) {
    //   throw new Error(`invalid number or constant: '${arraySizeToken}'`);
    // }
    assertEqual(nextToken(tokens), "]");
    assertEqual(nextToken(tokens), ";");
  }
  return { type, identifier, arraySize };
}

function parseStructBody(context: ParseContext) {
  const tokens = context.tokens;
  assertEqual(nextToken(tokens), "{");

  const fields = [];
  while (peekToken(tokens) !== "}") {
    const field = parseField(context);
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

export function parseStruct(context: ParseContext): StructInfo {
  const { tokens } = context;
  const type = nextToken(tokens);
  assertEqual(type, "struct");

  let identifier = nextToken(tokens);
  assertDefined(identifier);

  const fields = parseStructBody(context);
  assertEqual(nextToken(tokens), ";");

  return { type, identifier, fields };
}

export function parseStructs(context: ParseContext) {
  const tokens = context.tokens;
  const structs = [];

  while (peekToken(tokens) === "struct") {
    const struct = parseStruct(context);
    structs.push(struct);
  }
  return structs;
}

export type ParseContext = {
  tokens: string[];
  constants: Map<string, number>;
};

export type StructInfo = {
  type: string;
  identifier: string;
  fields: {
    type: string;
    identifier: string;
    arraySize: string | undefined;
  }[];
};
