import React from "react";

export default function Alert(props) {
  const capitalize = (str) => {
    if (str === "danger") {
      str = "error";
    }
    return str[0].toUpperCase() + str.slice(1);
  };
  return (
    <div>
      {props.alert && <div className={`alert alert-${props.alert.type}`} role="alert">
        <strong>{capitalize(props.alert.type)}</strong>: {props.alert.msg}
      </div>}
    </div>
  );
}
