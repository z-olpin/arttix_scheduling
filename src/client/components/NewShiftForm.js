import React from "react";
import { toTitleCase } from "../utils/utils";

const NewShiftForm = ({employees, changeHour, changeMin, changeEmployee}) => {
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
        <select onChange={changeHour}>
          <option value="">HH</option>
          {[
            ["6", "6"],
            ["7", "7"],
            ["8", "8"],
            ["9", "9"],
            ["10", "10"],
            ["11", "11"],
            ["12", "12"],
            ["1", "13"],
            ["2", "14"],
            ["3", "15"],
            ["4", "16"],
            ["5", "17"],
            ["6", "18"],
            ["7", "19"],
            ["8", "20"],
            ["9", "21"],
            ["10", "22"]
          ].map(hour => (
            <option value={hour[1]}>{hour[0]}</option>
          ))}
        </select>
        :
        <select onChange={changeMin}>
          <option value="">MM</option>
          {["00", "15", "30", "45"].map(min => (
            <option value={min}>{min}</option>
          ))}
        </select>
      </div>
    </div>
    <hr/>
    </>
  );
};


export default  NewShiftForm