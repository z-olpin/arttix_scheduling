import React, { useState, useEffect } from 'react';
import { addWeeks, startOfWeek, endOfWeek } from "date-fns"
import '../../public/index.css'
import { Route, Switch, BrowserRouter } from "react-router-dom"
import { formatShifts } from "../utils/utils"
import Header from "./pages/Header"
import ViewSchedule from './pages/ViewSchedule'
import UploadSchedule from "./pages/UploadSchedule"
import CreateSchedule from './pages/CreateSchedule'

const App = () => {
  const [user, setUser] = useState()
  const [shifts, setShifts] = useState()
  const [employees, setEmployees] = useState([])
  const weekdayColumnHeaders = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const buildings = ['Abravanel', 'Capitol', 'Delta', 'Regent', 'Rose']
  const timeRowHeaders = ['8a', '10a', '12p', '2p', '4p', '6p', '8p']
  const [targetWeekRange, setTargetWeekRange] = useState([
    startOfWeek(Date.now(), {weekStartsOn: 1}),
    endOfWeek(Date.now(), {weekStartsOn: 1})
  ])

  // Get employee names
  useEffect(() => {
    fetch('http://localhost:5000/employees', {method: 'GET'})
      .then(r => r.json())
      .then(r => setEmployees(r.map(empObj => empObj.name)))
  }, [])

  // Get user's shifts
  useEffect(() => {
    fetch(`http://localhost:5000/employees/${user}/shifts`, { method: 'POST', body: JSON.stringify(targetWeekRange), headers: {'Content-Type': 'application/json'}})
      .then(r => r.json())
      .then(rows => setShifts(formatShifts(rows)))
  }, [user, targetWeekRange])

  const changeTargetWeek = n => {
    const _targetWeekRange = [...targetWeekRange].map(day => addWeeks(day, n))
    setTargetWeekRange(_targetWeekRange)
  }

  const handleUserChange = e => {
    e.preventDefault()
    setUser(e.target.value)
  }

  return (
    <>
      <BrowserRouter>
        <Header handleUserChange={handleUserChange} employees={employees}/>
        <main>
          <Switch>
            <Route path='/index.html'>
              <ViewSchedule targetWeekRange={targetWeekRange} changeTargetWeek={changeTargetWeek} shifts={shifts} weekdayColumnHeaders={weekdayColumnHeaders} timeRowHeaders={timeRowHeaders}/>
            </Route>
            <Route path='/upload'>
              <UploadSchedule />
            </Route>
            <Route path='/create'>
              <CreateSchedule weekdayColumnHeaders={weekdayColumnHeaders} employees={employees} buildings={buildings}/>
            </Route>
          </Switch>
        </main>
      </BrowserRouter>
    </>
  )
}

export default App