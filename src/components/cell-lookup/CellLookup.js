import React, { useEffect, useState } from "react";
import _ from "lodash";
import "./CellLookup.scss";
function CellLookup({ data }) {
  const { lookup } = data.column;
  const [value, setValue] = useState([]);
  useEffect(() => {
    data.value && _.isArray(data.value)
      ? setValue(data.value)
      : data.value
      ? setValue(data.value.split(","))
      : setValue([]);
  }, []);
  return (
    <ul className="cell-component">
      {value.map((v) => (
        <li key={v}>{lookup.valueMap[v]}</li>
      ))}
    </ul>
  );
}

export default CellLookup;
