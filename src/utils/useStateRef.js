import { useState, useRef } from "react";

const useStateRef = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const valueRef = useRef(value);
  valueRef.current = value;
  return [value, setValue, valueRef];
}

export default useStateRef;