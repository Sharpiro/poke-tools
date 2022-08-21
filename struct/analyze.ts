import { ParsedStruct } from "./parse.ts";

const primitives = new Map<string, PrimitiveType>([
  ["bool", { name: "bool", size: 8, isPrimitive: true }],
  ["u8", { name: "u8", size: 8, isPrimitive: true }],
  ["u16", { name: "u16", size: 16, isPrimitive: true }],
  ["u32", { name: "u32", size: 32, isPrimitive: true }],
]);

export function getAnalyzedStructs(
  parsedStructs: ParsedStruct[],
  constants: Map<string, number>,
) {
  const analyzedStructs = [];
  for (const parsedStruct of parsedStructs) {
    const analyzedStructMap = new Map(
      analyzedStructs.map((s) => [s.identifier, s]),
    );
    const analyzedStruct = getAnalyzedStruct(
      parsedStruct,
      constants,
      analyzedStructMap,
    );
    analyzedStructs.push(analyzedStruct);
  }
  return analyzedStructs;
}

export function getAnalyzedStruct(
  parsedStruct: ParsedStruct,
  constants: Map<string, number>,
  analyzedStructs: Map<string, AnalyzedStruct>,
) {
  const fields: AnalyzedField[] = [];
  for (const parsedField of parsedStruct.fields) {
    let fieldType: PrimitiveType | AnalyzedStruct;
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

    let arraySize: number | undefined;
    if (parsedField.arraySize !== undefined) {
      const constantValue = constants.get(parsedField.arraySize);
      if (constantValue !== undefined) {
        arraySize = constantValue;
      } else {
        arraySize = Number(parsedField.arraySize);
      }
      if (isNaN(arraySize)) {
        throw new Error(
          `invalid number or constant: '${parsedField.arraySize}'`,
        );
      }
    }

    const field = {
      type: fieldType,
      identifier: parsedField.identifier,
      arraySize,
    };
    fields.push(field);
  }

  const analyzedStruct: AnalyzedStruct = {
    identifier: parsedStruct.identifier,
    fields,
    isPrimitive: false,
  };
  return analyzedStruct;
}

export type PrimitiveType = { name: string; size: number; isPrimitive: true };

export type AnalyzedField = {
  type: PrimitiveType | AnalyzedStruct;
  identifier: string;
  arraySize: number | undefined;
};

export type AnalyzedStruct = {
  identifier: string;
  fields: AnalyzedField[];
  isPrimitive: false;
};
