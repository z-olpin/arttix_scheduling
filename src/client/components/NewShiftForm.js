import React from "react";
import { toTitleCase } from "../utils/utils";

const NewShiftForm = ({employees, changeTimeIn, changeTimeOut, changeEmployee}) => {
  return (
    <>
    <div className="new-shift-form">
      <select onChange={changeEmployee}>
        <option selected>Employee</option>
        {employees.map(emp => (
          <option value={emp}>{toTitleCase(emp)}</option>
        ))}
      </select>
      <div>
        <input type="time" onChange={changeTimeIn} />
        <input type="time" onChange={changeTimeOut} />
      </div>
    </div>
    <hr/>
    </>
  );
};

export default  NewShiftForm