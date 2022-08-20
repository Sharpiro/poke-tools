function assert(condition: any) {
  if (!condition) {
    throw new Error();
  }
}

function assertEqual(left: any, right: any) {
  if (left !== right) {
    throw new Error(`'${left}' !== '${right}'`);
  }
}

// function popToken(tokens: string[]) {
//   // tokens.shift
//   return tokens.slice();
// }

function parseField(tokens: string[]) {
  // let type: string;
  // ({ token: type, newData: tokens } = parseToken(tokens));
  const type = tokens[0];
  assert(type);
  // tokens = parseWhitespace(tokens);
  tokens = tokens.slice(1);

  // ({ token: identifier, newData: tokens } = parseToken(tokens));
  const identifier = tokens[0];
  assert(identifier);
  tokens = tokens.slice(1);

  assertEqual(tokens[0], ";");
  tokens = tokens.slice(1);
  return { field: { type, identifier }, tokens };
}

function parseStructBody(tokens: string[]) {
  // ({ token, newData: tokens } = parseToken(tokens));
  assertEqual(tokens[0], "{");
  tokens = tokens.slice(1);

  // parse 0 or more fields
  let fieldOne: any;
  ({ field: fieldOne, tokens } = parseField(tokens));
  let fieldTwo: any;
  ({ field: fieldTwo, tokens } = parseField(tokens));
  let fieldThree: any;
  ({ field: fieldThree, tokens } = parseField(tokens));
  let fieldFour: any;
  ({ field: fieldFour, tokens } = parseField(tokens));
  let fieldFive: any;
  ({ field: fieldFive, tokens } = parseField(tokens));

  // ({ token, newData: tokens } = parseToken(tokens));
  assertEqual(tokens[0], "}");
  tokens = tokens.slice(1);
  // tokens = parseWhitespace(tokens);

  return {
    fields: [fieldOne, fieldTwo, fieldThree, fieldFour, fieldFive],
    struct: tokens,
  };
}

export function parseStruct(tokens: string[]) {
  // let type: string;
  // ({ token: type, newData: tokens } = parseToken(tokens));
  const type = tokens[0];
  assertEqual(type, "struct");
  // tokens = parseWhitespace(tokens);
  tokens = tokens.slice(1);

  // ({ token: structName, newData: tokens } = parseToken(tokens));
  const structName = tokens[0];
  assertEqual(structName, "Temp");
  tokens = tokens.slice(1);
  // tokens = parseWhitespace(tokens);

  let fields: unknown[];
  ({ fields, struct: tokens } = parseStructBody(tokens));
  return { type, identifier: structName, fields };
}
