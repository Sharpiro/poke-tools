// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const symbols = new Set([
    ";",
    "[",
    "]",
    "{",
    "}"
]);
function lexTokens(code) {
    const tokens = [];
    code = removeWhitespace(code);
    code = removeComment(code);
    while(code){
        let token;
        ({ token , newData: code  } = lexToken(code));
        tokens.push(token);
        code = removeWhitespace(code);
        code = removeComment(code);
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
function removeComment(source) {
    if (source[0] !== "/" || source[1] !== "/") {
        return source;
    }
    while(source[0] === "/" && source[1] === "/"){
        let i = 2;
        while(source[i] !== "\n"){
            i++;
        }
        source = source.slice(i + 1);
        source = removeWhitespace(source);
    }
    return source;
}
function assertDefined(condition) {
    if (!condition) {
        throw new Error();
    }
}
function assertEqual(actual, expected) {
    if (actual !== expected) {
        throw new Error(`'${actual}' !== '${expected}'`);
    }
}
function parseField(tokens) {
    const typeOrStructKeyword = nextToken(tokens);
    const type = typeOrStructKeyword === "struct" ? nextToken(tokens) : typeOrStructKeyword;
    assertDefined(type);
    const identifier = nextToken(tokens);
    assertDefined(identifier);
    const peek = peekToken(tokens);
    let arraySize;
    if (peek === ";") {
        assertEqual(nextToken(tokens), ";");
    } else {
        assertEqual(nextToken(tokens), "[");
        arraySize = nextToken(tokens);
        assertDefined(arraySize);
        assertEqual(nextToken(tokens), "]");
        assertEqual(nextToken(tokens), ";");
    }
    return {
        type,
        identifier,
        arraySize
    };
}
function parseStructBody(tokens) {
    assertEqual(nextToken(tokens), "{");
    const fields = [];
    while(peekToken(tokens) !== "}"){
        const field = parseField(tokens);
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
function parseStruct(tokens) {
    const type = nextToken(tokens);
    assertEqual(type, "struct");
    let identifier = nextToken(tokens);
    assertDefined(identifier);
    const fields = parseStructBody(tokens);
    assertEqual(nextToken(tokens), ";");
    return {
        identifier,
        fields
    };
}
const primitives = new Map([
    [
        "bool",
        {
            identifier: "bool",
            size: 8,
            isPrimitive: true
        }
    ],
    [
        "u8",
        {
            identifier: "u8",
            size: 8,
            isPrimitive: true
        }
    ],
    [
        "u16",
        {
            identifier: "u16",
            size: 16,
            isPrimitive: true
        }
    ],
    [
        "u32",
        {
            identifier: "u32",
            size: 32,
            isPrimitive: true
        }
    ], 
]);
function analyzeStruct(parsedStruct, constants, analyzedStructs) {
    const fields = [];
    for (const parsedField of parsedStruct.fields){
        let fieldType;
        const primitiveType = primitives.get(parsedField.type);
        if (primitiveType) {
            fieldType = primitiveType;
        } else {
            const structType = analyzedStructs.get(parsedField.type);
            if (!structType) {
                throw new Error(`invalid type: '${parsedField.type}'`);
            }
            fieldType = structType;
        }
        let arraySize;
        if (parsedField.arraySize !== undefined) {
            const constantValue = constants.get(parsedField.arraySize);
            if (constantValue !== undefined) {
                arraySize = constantValue;
            } else {
                arraySize = Number(parsedField.arraySize);
            }
            if (isNaN(arraySize)) {
                throw new Error(`invalid number or constant: '${parsedField.arraySize}'`);
            }
        }
        const field = {
            type: fieldType,
            typeIdentifier: fieldType.identifier,
            identifier: parsedField.identifier,
            arraySize
        };
        fields.push(field);
    }
    const analyzedStruct = {
        identifier: parsedStruct.identifier,
        fields,
        isPrimitive: false
    };
    return analyzedStruct;
}
function getUnpackedStruct(analyzedStruct, buffer, ctx = {
    index: 0
}) {
    const obj = {};
    for (const field of analyzedStruct.fields){
        if (field.type.isPrimitive) {
            const byteSize = field.type.size / 8;
            if (field.arraySize === undefined) {
                const slice = buffer.slice(ctx.index, ctx.index + byteSize);
                const num = toNumberLE(slice);
                ctx.index += byteSize;
                obj[field.identifier] = num;
            } else {
                let numArray = [];
                for(let i = 0; i < field.arraySize; i++){
                    const slice1 = buffer.slice(ctx.index, ctx.index + byteSize);
                    const num1 = toNumberLE(slice1);
                    numArray.push(num1);
                    ctx.index += byteSize;
                }
                obj[field.identifier] = numArray;
            }
        } else {
            const objField = getUnpackedStruct(field.type, buffer, ctx);
            obj[field.identifier] = objField;
        }
    }
    return obj;
}
function toNumberLE(buffer) {
    let x = 0;
    for(let i = 0; i < buffer.length; i++){
        const __byte = buffer[i];
        const byteShifted = __byte << i * 8;
        x |= byteShifted;
    }
    return x;
}
function doAll(source, buffer) {
    const tokens = lexTokens(source);
    const parsedStruct = parseStruct(tokens);
    const analyzedStruct = analyzeStruct(parsedStruct, new Map(), new Map());
    const unpackedStruct = getUnpackedStruct(analyzedStruct, buffer);
    return unpackedStruct;
}
export { doAll as doAll };
