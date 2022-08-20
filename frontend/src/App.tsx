import { useEffect, useState } from "react";
import { useEventOnce } from "./hooks/useEventOnce";
import { parseStruct } from "./lib/struct";

const testStruct = `struct Temp
{
  bool a;
  u8 b;
  u16 c;
  u32 d;
};`;

function App() {
  // const [add, setAdd] = useState<any>();
  // const [mapStruct, setMapStruct] = useState<any>();
  // const [count, setCount] = useState(0);

  // useEffect(() => {
  //   console.log(count);
  //   if (count === 5) {
  //     throw new Error("something wrong");
  //   }
  //   // setTimeout(() => {
  //   // }, 5_000);
  // }, [count]);

  useEventOnce(() => {
    // createModule()
    //   .then((module: any) => {
    //     setAdd(() => module.cwrap("add", "number", ["number", "number"]));
    //     setMapStruct(() => module.cwrap("map_struct", "number", ["array"]));
    //     // console.log("add", whatever);
    //     console.log("created module");
    //   })
    //   .catch((err: any) => {
    //     console.error(err);
    //   });
    // console.log(parseStruct);
    // console.log("LOG THIS ONCE BRO");
    try {
      parseStruct(testStruct);
    } catch (err) {
      console.error(err);
    }
  });

  return (
    <div style={{ margin: "auto", marginTop: 100, width: "50%" }}>
      <div>hi there</div>
      <div>
        <button
          onClick={() => {
            // setCount(count + 1);
            // const result = add(2, 3);
            // console.log("result", result);
            // const buffer = new Uint8Array([1, 2, 3, 4]);
            // const result = mapStruct(buffer);
            // console.log("result", result);
          }}
        >
          Map
        </button>
      </div>
    </div>
  );
}

export default App;
