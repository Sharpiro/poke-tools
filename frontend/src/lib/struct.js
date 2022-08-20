// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const symbols = new Set([
    ";",
    "[",
    "]"
]);
function lexTokens(code) {
    const tokens = [];
    while(code){
        let token;
        ({ token , newData: code  } = lexToken(code));
        tokens.push(token);
        code = removeWhitespace(code);
    }
    return tokens;
}
function lexToken(data) {
    const firstChar = data[0];
    if (symbols.has(firstChar)) {
        return {
            token: firstChar,
            newData: data.slice(1)
        };
    }
    const shouldCheckNextChar = (i)=>{
        return i < data.length && !symbols.has(currentChar) && currentChar !== " " && currentChar !== "\n";
    };
    let currentChar = firstChar;
    let j = 0;
    for(let i = 1; shouldCheckNextChar(i); i++){
        currentChar = data[i];
        j++;
    }
    const token = data.slice(0, j);
    const newData = data.slice(j);
    return {
        token,
        newData
    };
}
function removeWhitespace(data) {
    let curr = data[0];
    if (curr !== " " && curr !== "\n") {
        return data;
    }
    let j = 0;
    for(let i = 1; curr === " " || curr === "\n"; i++){
        curr = data[i];
        j++;
    }
    const newData = data.slice(j);
    return newData;
}
function assertDefined(condition) {
    if (!condition) {
        throw new Error();
    }
}
function assertNumber(num) {
    if (isNaN(num)) {
        throw new Error("invalid number");
    }
}
function assertEqual(actual, expected) {
    if (actual !== expected) {
        throw new Error(`'${actual}' !== '${expected}'`);
    }
}
function parseField(context) {
    const { tokens , constants  } = context;
    const type = nextToken(tokens);
    assertDefined(type);
    const identifier = nextToken(tokens);
    assertDefined(identifier);
    const peek = peekToken(tokens);
    let arraySize;
    if (peek === ";") {
        assertEqual(nextToken(tokens), ";");
    } else {
        assertEqual(nextToken(tokens), "[");
        const arraySizeToken = nextToken(tokens);
        assertDefined(arraySizeToken);
        const constantValue = constants.get(arraySizeToken);
        if (constantValue !== undefined) {
            arraySize = constantValue;
        } else {
            arraySize = Number(arraySizeToken);
        }
        assertNumber(arraySize);
        assertEqual(nextToken(tokens), "]");
        assertEqual(nextToken(tokens), ";");
    }
    return {
        type,
        identifier,
        arraySize
    };
}
function parseStructBody(context) {
    const tokens = context.tokens;
    assertEqual(nextToken(tokens), "{");
    const fields = [];
    while(peekToken(tokens) !== "}"){
        const field = parseField(context);
        fields.push(field);
    }
    assertEqual(nextToken(tokens), "}");
    return fields;
}
function nextToken(tokens) {
    return tokens.shift();
}
function peekToken(tokens) {
    return tokens.at(0);
}
function parseStruct(context) {
    const { tokens  } = context;
    const type = nextToken(tokens);
    assertEqual(type, "struct");
    let identifier = nextToken(tokens);
    assertDefined(identifier);
    const fields = parseStructBody(context);
    return {
        type,
        identifier,
        fields
    };
}
function parseStruct1(code, constants) {
    const tokens = lexTokens(code);
    console.log(tokens);
    constants = constants ?? new Map();
    const structInfo = parseStruct({
        tokens: tokens.slice(),
        constants
    });
    console.log(structInfo);
    return structInfo;
}
export { parseStruct1 as parseStruct };
