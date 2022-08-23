const symbols = new Set([";", "[", "]", "{", "}"]);

export function lexTokens(code: string) {
  const tokens: string[] = [];
  code = removeWhitespace(code);
  code = removeComment(code);
  while (code) {
    let token: string;
    ({ token, newData: code } = lexToken(code));
    tokens.push(token);
    code = removeWhitespace(code);
    code = removeComment(code);
  }
  return tokens;
}

function lexToken(data: string) {
  const firstChar = data[0];
  if (symbols.has(firstChar)) {
    return { token: firstChar, newData: data.slice(1) };
  }

  // const shouldCheckNextChar = (i: number) => {
  //   return (
  //     !symbols.has(currentChar) &&
  //     i < data.length &&
  //     // data[i + 1] !== " " &&
  //     currentChar !== " " &&
  //     // data[i + 1] !== "\n"
  //     currentChar !== "\n"
  //   );
  // };

  // let currentChar = firstChar;
  // let j = 1;
  // for (let i = 1; shouldCheckNextChar(i); i++) {
  let i = 1;
  for (; true; i++) {
    const curr = data.at(i);
    if (curr === undefined || curr === "\n" || curr === " ") {
      break;
    }
    if (symbols.has(curr)) {
      break;
    }
  }

  const token = data.slice(0, i);
  const newData = data.slice(i);
  return { token, newData };
}

export function removeWhitespace(data: string) {
  let curr = data[0];
  if (curr !== " " && curr !== "\n") {
    return data;
  }

  let j = 0;
  for (let i = 1; curr === " " || curr === "\n"; i++) {
    curr = data[i];
    j++;
  }

  const newData = data.slice(j);
  return newData;
}

function removeComment(source: string) {
  if (source[0] !== "/" || source[1] !== "/") {
    return source;
  }
  // source = source.slice(2);

  while (source[0] === "/" && source[1] === "/") {
    let i = 2;
    while (source[i] !== "\n") {
      i++;
    }
    source = source.slice(i + 1);
    source = removeWhitespace(source);
  }

  // source = source.slice(i + 1);
  // source = removeWhitespace(source);
  return source;
}
