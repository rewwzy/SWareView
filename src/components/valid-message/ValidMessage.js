import React from "react";

export default function ValidMessage({ message = "" }) {
  return (
    <div
      style={{
        minHeight: 10,
        color: "red",
        fontSize: 12,
        paddingTop: 2,
      }}
    >
      {message && message}
    </div>
  );
}
