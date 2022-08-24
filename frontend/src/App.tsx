import { useState } from "react";
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
// #define ALL_SECTOR_COUNT 32
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
  // struct Sector sectors[ALL_SECTOR_COUNT];
  struct Sector sectors[6];
};
`;

const testBuffer = "0x01 0x02 0x03 0x04 0x05 0x06";

const darkStyle = { background: "#342121", color: "white" };

function App() {
  const [source, setSource] = useState(testStruct.trim());
  // const [variableInput, setVariableInput] = useState(testStruct);
  const [bufferText, setBufferText] = useState(testBuffer);

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
          }}
        >
          Debug
        </button>
      </div>
    </div>
  );
}

export default App;
