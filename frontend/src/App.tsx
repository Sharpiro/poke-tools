import { useOnMount } from "./hooks/useOnMount";
import { parseStruct } from "./lib/struct";

const testStruct = `struct Temp
{
  bool a;
  u8 b;
  u16 c;
  u32 d;
  u8 e[50];
};`;

function App() {
  useOnMount(() => {
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
            //
          }}
        >
          Debug
        </button>
      </div>
    </div>
  );
}

export default App;
