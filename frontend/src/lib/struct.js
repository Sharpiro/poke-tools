// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const symbols = new Set([
    ";"
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
function assert(condition) {
    if (!condition) {
        throw new Error();
    }
}
function assertEqual(left, right) {
    if (left !== right) {
        throw new Error(`'${left}' !== '${right}'`);
    }
}
function parseField(tokens) {
    const type = tokens[0];
    assert(type);
    tokens = tokens.slice(1);
    const identifier = tokens[0];
    assert(identifier);
    tokens = tokens.slice(1);
    assertEqual(tokens[0], ";");
    tokens = tokens.slice(1);
    return {
        field: {
            type,
            identifier
        },
        tokens
    };
}
function parseStructBody(tokens) {
    assertEqual(tokens[0], "{");
    tokens = tokens.slice(1);
    let fieldOne;
    ({ field: fieldOne , tokens  } = parseField(tokens));
    let fieldTwo;
    ({ field: fieldTwo , tokens  } = parseField(tokens));
    let fieldThree;
    ({ field: fieldThree , tokens  } = parseField(tokens));
    let fieldFour;
    ({ field: fieldFour , tokens  } = parseField(tokens));
    let fieldFive;
    ({ field: fieldFive , tokens  } = parseField(tokens));
    assertEqual(tokens[0], "}");
    tokens = tokens.slice(1);
    return {
        fields: [
            fieldOne,
            fieldTwo,
            fieldThree,
            fieldFour,
            fieldFive
        ],
        struct: tokens
    };
}
function parseStruct(tokens) {
    const type = tokens[0];
    assertEqual(type, "struct");
    tokens = tokens.slice(1);
    const structName = tokens[0];
    assertEqual(structName, "Temp");
    tokens = tokens.slice(1);
    let fields;
    ({ fields , struct: tokens  } = parseStructBody(tokens));
    return {
        type,
        identifier: structName,
        fields
    };
}
function parseStruct1(code) {
    const tokens = lexTokens(code);
    console.log(tokens);
    const structInfo = parseStruct(tokens);
    console.log(structInfo);
    return structInfo;
}
export { parseStruct1 as parseStruct };
