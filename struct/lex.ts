const symbols = new Set([";", "[", "]", "{", "}"]);

export function lexTokens(source: string) {
  const tokens: Token[] = [];
  // const tokens: string[] = [];
  const lexContext: LexContext = { source, index: 0 };
  // while (lexContext.source) {
  while (lexContext.index < lexContext.source.length) {
    removeWhitespace(lexContext);
    removeComment(lexContext);
    // let token: string;
    // let token: Token;
    // const tokenStart = lexContext.index;
    const token = lexToken(lexContext);
    if (token) {
      tokens.push(token);
    }
    // lexContext.index += token.length;
    // tokens.push({ value: token, start: tokenStart, end: token.length });
    // removeWhitespace(lexContext);
    // removeComment(lexContext);
  }
  return tokens;
}

function lexToken(lexContext: LexContext) {
  if (lexContext.index >= lexContext.source.length) {
    return undefined;
  }

  const sourceSlice = lexContext.source.slice(lexContext.index);
  const firstChar = sourceSlice[0];
  if (symbols.has(firstChar)) {
    // return { token: firstChar, newData: source.slice(1) };
    // lexContext.source = lexContext.source.slice(1);
    // return firstChar;
    // const tokenValue = lexContext.source.slice(0, i);
    const token = {
      value: firstChar,
      start: lexContext.index,
      end: lexContext.index + firstChar.length,
    };
    // lexContext.source = lexContext.source.slice(i);
    lexContext.index = token.end;
    return token;
  }

  let i = 1;
  for (; true; i++) {
    const curr = sourceSlice.at(i);
    if (curr === undefined || curr === "\n" || curr === " ") {
      break;
    }
    if (symbols.has(curr)) {
      break;
    }
  }

  const tokenValue = sourceSlice.slice(0, i);
  const token = {
    value: tokenValue,
    start: lexContext.index,
    end: lexContext.index + tokenValue.length,
  };
  // lexContext.source = lexContext.source.slice(i);
  // lexContext.index += tokenValue.length;
  lexContext.index = token.end;

  return token;
  // const newData = source.slice(i);
  // const tokenStart = lexContext.index;
  // tokens.push({ value: token, start: tokenStart, end: token.length });
}

export function removeWhitespace(lexContext: LexContext) {
  const sourceSlice = lexContext.source.slice(lexContext.index);
  // let curr = lexContext.source[0];
  let curr = sourceSlice[0];
  if (curr !== " " && curr !== "\n") {
    // return source;
    return;
  }

  let j = 0;
  for (let i = 1; curr === " " || curr === "\n"; i++) {
    // curr = lexContext.source[i];
    curr = sourceSlice[i];
    j++;
  }

  // const newData = source.slice(j);
  // lexContext.source = lexContext.source.slice(j);
  lexContext.index += j;
  // return newData;
}

function removeComment(lexContext: LexContext) {
  let sourceSlice = lexContext.source.slice(lexContext.index);
  while (sourceSlice[0] === "/" && sourceSlice[1] === "/") {
    let i = 2;
    while (sourceSlice[i] !== "\n") {
      i++;
    }
    // source = source.slice(i + 1);
    // lexContext.source = lexContext.source.slice(i + 1);
    lexContext.index += i + 1;
    removeWhitespace(lexContext);
    sourceSlice = lexContext.source.slice(lexContext.index);
  }

  // source = source.slice(i + 1);
  // source = removeWhitespace(source);
  // return source;
}

export type Token = { value: string; start: number; end: number };

export type LexContext = { readonly source: string; index: number };
