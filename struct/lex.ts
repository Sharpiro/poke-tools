const symbols = new Set([";", "[", "]"]);

export function lexTokens(code: string) {
  const tokens: string[] = [];
  code = removeWhitespace(code);
  while (code) {
    let token: string;
    ({ token, newData: code } = lexToken(code));
    tokens.push(token);
    code = removeWhitespace(code);
  }
  return tokens;
}

function lexToken(data: string) {
  const firstChar = data[0];
  if (symbols.has(firstChar)) {
    return { token: firstChar, newData: data.slice(1) };
  }

  const shouldCheckNextChar = (i: number) => {
    return (
      i < data.length &&
      !symbols.has(currentChar) &&
      currentChar !== " " &&
      currentChar !== "\n"
    );
  };

  let currentChar = firstChar;
  let j = 0;
  for (let i = 1; shouldCheckNextChar(i); i++) {
    currentChar = data[i];
    j++;
  }

  const token = data.slice(0, j);
  const newData = data.slice(j);
  return { token, newData };
}

function removeWhitespace(data: string) {
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
