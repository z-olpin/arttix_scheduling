import React, { useState, useEffect } from "react";
import { addDays, startOfWeek, format } from "date-fns";
import NewShiftForm from "../NewShiftForm";

const CreateSchedule = ({weekdayColumnHeaders, buildings, employees }) => {

  const [week, setWeek] = useState([])
  const [shifts, setShifts] = useState({})

  useEffect(() => {
    let weekBegin = startOfWeek(Date.now(), {weekStartsOn: 1})
    let _week = [...Array(7).keys()].map(v => format(addDays(weekBegin, Number(v) + 7), 'MMM dd'))
    setWeek(_week)
  }, [])

  useEffect(() => {
    let _shifts = {}
    buildings.map(b => _shifts[b] = {})
    for (let b of buildings) {
      for (let day of week) {
        _shifts[b][day] = []
      }
    }
    setShifts(_shifts)
  }, [week])

  const changeEmployee = (e, building, day) => {
    let _shifts = {...shifts}
    let val = e.target.value
    let lastInd = _shifts[building][day].length - 1
    _shifts[building][day][lastInd]['emp'] = val
    setShifts(_shifts)
  }

  const changeTimeIn = (e, building, day) => {
    let _shifts = {...shifts}
    let val = e.target.value
    let lastInd = _shifts[building][day].length - 1
    _shifts[building][day][lastInd]['in'] = val
    setShifts(_shifts)
  }
  const changeTimeOut = (e, building, day) => {
    let _shifts = {...shifts}
    let val = e.target.value
    let lastInd = _shifts[building][day].length - 1
    _shifts[building][day][lastInd]['out'] = val
    setShifts(_shifts)
  }

  const addShift = (building, day) => {
    let _shifts = {...shifts}
    _shifts[building][day].push({emp: null, in: null, out: null})
    setShifts(_shifts)
  }
  
  const submitShifts = () => {
    fetch('http://localhost:5000/shifts', {method: 'POST', body: JSON.stringify(shifts), headers: {'Content-Type': 'application/json'}})
  }

  return (
    <>
    <h1>{week[0]} - {week[week.length-1]}</h1>
      <table>
        <thead>
          <tr>
            <th></th>
            {weekdayColumnHeaders.map(day => (
              <th>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(shifts).map(building => (
            <tr>
              <th>{building}</th>
              {Object.keys(shifts[building]).map(d => (
                <td>
                  {shifts[building][d].map((_v, i) => 
                    <NewShiftForm
                      changeTimeIn={e => changeTimeIn(e, building, d)}
                      changeTimeOut={e => changeTimeOut(e, building, d)}
                      changeEmployee={e => changeEmployee(e, building, d)}
                      employees={employees}
                    />
                  )}
                  <button onClick={() => addShift(building, d)}>Add a shift</button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => {console.table(shifts)}}>console.table(shifts)</button>
      <button onClick={submitShifts}>SUBMIT</button>
    </>
  )
}

export default CreateSchedule;
