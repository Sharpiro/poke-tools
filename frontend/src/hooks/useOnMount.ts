import { useEffect, useRef } from "react";

export function useOnMount(func: Function) {
  const funcRef = useRef(func);
  const runRef = useRef(false);

  useEffect(() => {
    if (!runRef.current) {
      runRef.current = true;
      funcRef.current?.();
    }
  }, []);
}
