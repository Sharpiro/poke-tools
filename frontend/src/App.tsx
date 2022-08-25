import { useMemo, useState } from "react";
import { getStructs, unpack } from "./lib/struct";

// const testStruct = `struct Temp
// {
//   bool a;
//   u8 b;
//   u16 c;
//   u8 e[2];
// };`;

const testStruct = `
// #define PLAYER_NAME_LENGTH 7
// #define SECTOR_COUNT 16
// #define ALL_SECTOR_COUNT SECTOR_COUNT * 2
#define ALL_SECTOR_COUNT 32
// #define SAVE_SLOT_SECTOR_COUNT 14
#define SECTOR_DATA_SIZE 3968
// #define SECTOR_FOOTER_SIZE 128
// #define SECTOR_UNUSED SECTOR_FOOTER_SIZE - 12
#define SECTOR_UNUSED 116
// #define SECTOR_SIZE 4096

struct Sector
{
  u8 data[SECTOR_DATA_SIZE];
  u8 unused[SECTOR_UNUSED];
  u16 id;
  u16 checksum;
  u32 signature;
  u32 counter;
};

struct SaveData
{
  struct Sector sectors[ALL_SECTOR_COUNT];
  // struct Sector sectors[1];
};
`;

const testBuffer = "0x01 0x02 0x03 0x04 0x05 0x0f 0xff";

const darkStyle = { background: "#342121", color: "white" };

function App() {
  const [source, setSource] = useState(testStruct.trim());
  // const [variableInput, setVariableInput] = useState(testStruct);
  const [bufferText, setBufferText] = useState(testBuffer);
  const [unpacked, setUnpacked] = useState<any>();
  const activeSectors = useMemo(() => {
    const sectors: any[] = unpacked?.sectors;
    if (!sectors) return;
    const counters = sectors.map((s) => s.counter);
    const recentCounter = Math.max(...counters);
    const activeSectors = sectors
      .filter((s) => s.counter === recentCounter)
      .sort((a, b) => a.id - b.id);
    return activeSectors;
  }, [unpacked]);

  const playerName = useMemo(() => {
    if (!activeSectors) return;
    const buffer: Uint8Array = activeSectors[0].data;
    const slice = buffer.slice(0, 7);
    // const name = getHex(slice).join(" ");
    const name = getPokeString(slice);
    return name;
  }, [activeSectors]);

  // useOnMount(() => {
  //   try {
  //     const result = doAll(testStruct);
  //     console.log(result);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // });

  return (
    <div style={{ margin: "auto", marginTop: 100, width: "50%" }}>
      <div>
        <textarea
          // style={{ background: "#342121", color: "white" }}
          style={{ ...darkStyle, width: "100%" }}
          rows={25}
          // cols={60}
          value={source}
          onChange={({ target: { value } }) => {
            setSource(value);
          }}
        >
        </textarea>
      </div>
      <div>
        <input
          style={{ ...darkStyle, width: "100%" }}
          type="text"
          value={bufferText}
          onChange={({ target: { value } }) => {
            setBufferText(value);
          }}
        />
      </div>

      <div>
        <button
          onClick={() => {
            const bufferNumbers = bufferText.split(" ").map((bt) =>
              parseInt(bt, 16)
            );
            const buffer = new Uint8Array(bufferNumbers);
            const structs = getStructs(source);
            console.log("buffer:", bufferNumbers);
            // console.log(JSON.stringify(result, null, 2));
            console.log("structs:", structs);
            const unpacked = unpack(structs[1], buffer);
            console.log("unpacked:", unpacked);
            console.log("unpacked:", debugDisplay(unpacked));
            setUnpacked(unpacked);
          }}
        >
          Debug
        </button>
        {}
        <input
          type="file"
          onChange={async ({ target }) => {
            console.log(target.files);
            const file = target.files?.[0];
            if (!file) return;

            const buffer = await file.arrayBuffer().then((b) =>
              new Uint8Array(b)
            );
            const structs = getStructs(source);
            console.log("buffer:", buffer.length);
            console.log("structs:", structs);
            const unpacked = unpack(structs[1], buffer);
            // console.log("unpacked:", unpacked);
            console.log("unpacked:", debugDisplay(unpacked));
            setUnpacked(unpacked);
          }}
        />
      </div>

      {/* {unpacked && ( */}
      <div style={{ marginTop: 25 }}>
        Player Name: {playerName}
      </div>
      {/* )} */}
    </div>
  );
}

function debugDisplay(sourceObj: object, debugObj: any = {}) {
  const props = Object.entries(sourceObj);
  for (const [key, value] of props) {
    if (ArrayBuffer.isView(value)) {
      debugObj[key] = getHex(value as Uint8Array);
    } else if (Array.isArray(value)) {
      const debugArray: any[] = [];
      for (const x of value) {
        if (typeof x === "number" || typeof x === "string") {
          debugArray.push(x);
        } else if (Array.isArray(x)) {
          throw new Error("no nested arrays");
        } else {
          const whatever = debugDisplay(x);
          debugArray.push(whatever);
        }
      }
      debugObj[key] = debugArray;
    } else if (typeof value === "object") {
      const whatever = debugDisplay(value);
      debugObj[key] = whatever;
    } else {
      debugObj[key] = value;
    }
  }
  return debugObj;
}

function getHex(buffer: Uint8Array) {
  return [...buffer].map((n) => `0x${n.toString(16).padStart(2, "0")}`);
}

function getPokeString(buffer: Uint8Array) {
  const chars: string[] = [];
  chars[0xd0] = "V";
  const pokeString = [...buffer].map((n) => chars[n]).join("");
  return pokeString;
}

export default App;
