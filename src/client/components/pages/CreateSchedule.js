import React, { useState, useEffect } from "react";
import { addDays, startOfWeek, format, addWeeks, setHours, setMinutes } from "date-fns";
import NewShiftForm from "../NewShiftForm";
import '../../../public/index.css'

const CreateSchedule = ({weekdayColumnHeaders, buildings, employees }) => {

  const [currentWeek, setCurrentWeek] = useState([])
  const [targetWeek, setTargetWeek] = useState()
  const [shifts, setShifts] = useState({})


  useEffect(() => {
    let startOfThisWeek = startOfWeek(Date.now(), {weekStartsOn: 1})
    let _week = [...Array(7).keys()].map(k => addDays(startOfThisWeek, k))
    setCurrentWeek(_week)
    setTargetWeek(_week)
  }, [])

  useEffect(() => {
    let _shifts = {}
    buildings.map(b => _shifts[b] = {})
    for (let b of buildings) {
      for (let day of targetWeek || currentWeek) {
        _shifts[b][day.toISOString()] = []
      }
    }
    setShifts(_shifts)
  }, [targetWeek])

  const changeTargetWeek = n => {
    const _week = [...targetWeek]
    const _targetWeek = _week.map(day => addWeeks(day, n))
    setTargetWeek(_targetWeek)
  }

  const changeEmployee = (e, building, day) => {
    let _shifts = {...shifts}
    let lastInd = _shifts[building][day].length - 1
    _shifts[building][day][lastInd]['employee'] = e.target.value
    setShifts(_shifts)
  }

  const changeTimeIn = (e, building, day) => {
    let _shifts = {...shifts}
    let [hour, min] = e.target.value.split(':').map(s => Number(s))
    let _startTime = setMinutes(setHours(new Date(day), hour), min).toISOString()
    let lastInd = _shifts[building][day].length - 1
    _shifts[building][day][lastInd]['startTime'] = _startTime
    setShifts(_shifts)
  }
  const changeTimeOut = (e, building, day) => {
    let _shifts = {...shifts}
    let [hour, min] = e.target.value.split(':').map(s => Number(s))
    let _endTime = setMinutes(setHours(new Date(day), hour), min).toISOString()
    let lastInd = _shifts[building][day].length - 1
    _shifts[building][day][lastInd]['endTime'] = _endTime
    setShifts(_shifts)
  }

  const addShift = (building, day) => {
    let _shifts = {...shifts}
    _shifts[building][day].push({employee: null, startTime: null, endTime: null})
    setShifts(_shifts)
  }
  
  const submitShifts = () => {
    fetch('http://localhost:5000/shifts', {method: 'POST', body: JSON.stringify(shifts), headers: {'Content-Type': 'application/json'}})
      .then(alert('Shifts added!'))
  }

  return (
    (!targetWeek) ? <></> :
    <>
    <div id="week-slider">
        <button className="week-button" onClick={() => changeTargetWeek(-1)}>&#8592;</button>
        <h1 id="week-title">{format(targetWeek[0], 'MM/dd')} - {format(targetWeek[6], 'MM/dd')}</h1>
        <button className="week-button" onClick={() => changeTargetWeek(1)}>&#8594;</button>
      </div>
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
