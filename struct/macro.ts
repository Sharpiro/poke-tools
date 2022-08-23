import { lexTokens, removeWhitespace } from "./lex.ts";
import { assertDefined, assertEqual } from "./tools.ts";

export function preProcess(source: string) {
  const originalSource = source;
  // let nextLine: string | undefined;
  // while ((nextLine = getNextLine(source))) {
  const constants = [];
  while (source) {
    const nextLine = getNextLine(source);
    const nextLineTrim = removeWhitespace(nextLine);
    // if (!nextLine) {
    //   break;
    // }

    if (nextLineTrim.startsWith("#define")) {
      let constant = parseDefineMacro(nextLine);
      constants.push(constant);
    }
    source = source.slice(nextLine.length + 1);
  }

  let modifiedSource = originalSource;
  for (const constant of constants) {
    modifiedSource = originalSource.replaceAll(
      constant.variableName,
      constant.variableValue,
    );
  }

  return modifiedSource;
}

function parseDefineMacro(defineLine: string) {
  const tokens = lexTokens(defineLine);
  assertEqual(tokens.length, 3);
  assertEqual(tokens[0], "#define");
  const variableName = tokens.at(1);
  assertDefined(variableName);
  const variableValue = tokens.at(2);
  assertDefined(variableValue);
  return {
    variableName,
    variableValue,
  };
}

function getNextLine(source: string) {
  let end = 0;
  for (let i = 0; i < source.length; i++) {
    if (source[i] === "\n") {
      break;
    }
    end++;
  }

  const line = source.slice(0, end);
  return line;
}
