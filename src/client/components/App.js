import React, { useState, useEffect } from 'react';
import empSched from "../empSched";

const App = () => {
  const [user, setUser] = useState('')
  const [AMShifts, setAMShifts] = useState([])
  const [afternoonShifts, setAfternoonShifts] = useState([])
  const [showShifts, setShowShifts] = useState([])
  const [suggestions, setSuggestions] = useState(['abigail', 'alicia', 'jacque', 'jacqueline', 'jaiden', 'jaron', 'jonathan', 'josie', 'kat', 'lisa', 'ocia', 'noorah', 'payton', 'sam', 'sammee', 'tim', 'whit', 'zach'])
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  useEffect(() => setAMShifts([...empSched.shifts.filter(s => s.employee == user && s.startTime.includes('am'))]), [user])

  useEffect(() => setAfternoonShifts([...empSched.shifts.filter(s => s.employee == user && s.startTime.includes('pm') && s.startTime < '4')]), [user])

  useEffect(() => setShowShifts([...empSched.shifts.filter(s => s.employee == user && s.startTime > '4' && s.startTime.includes('pm'))]), [user])

  const handleUserChange = e => {
    e.preventDefault()
    setUser(e.target.value)
  }

  return (
    <>
      <nav style={{ marginBottom: '1rem' }}>
        <div className="nav-wrapper z-depth-3" style={{ backgroundColor: "#0000ff" }}>
          <a href="#" className="brand-logo" style={{ marginLeft: '1.5rem' }}>zchedul_</a>
          <ul className="right valign-wrapper" style={{ marginRight: '1.2rem' }}>
            <li>
              <div style={{ marginRight: '1.2rem' }}>USER:</div>
            </li>
            <li>
              <input type="text" onChange={handleUserChange} value={user} list="suggestions" style={{ color: '#ffffff' }}>
              </input>
              <datalist id="suggestions">
                {suggestions.map(s => <option value={s}></option>)}
              </datalist>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container" style={{ width: '90vw' }}>
        <div className="row" style={{ borderBottom: '0.2em solid #0000ff' }}>
          <h3 style={{ fontWeight: 500, color: '#0000ff' }}>Your week</h3>
        </div>
        <h6 style={{ fontSize: '1.4rem', fontStyle: 'italic', color: 'grey' }}>09/16 &mdash;  09/22</h6>
        <table style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr className="row">
              <th className="center-align" style={{ width: '14.28%' }}></th>
              <th className="center-align" style={{ width: '14.28%' }}>Monday</th>
              <th className="center-align" style={{ width: '14.28%' }}>Tuesday</th>
              <th className="center-align" style={{ width: '14.28%' }}>Wednesday</th>
              <th className="center-align" style={{ width: '14.28%' }}>Thursday</th>
              <th className="center-align" style={{ width: '14.28%' }}>Friday</th>
              <th className="center-align" style={{ width: '14.28%' }}>Saturday</th>
              <th className="center-align" style={{ width: '14.28%' }}>Sunday</th>
            </tr>
          </thead>
          <tbody className="row">
            <tr>
              <th>AM</th>
              {weekdays.map(day => {
                const shiftInd = AMShifts.map(s => s.weekDay).indexOf(day)
                if (shiftInd >= 0) {
                  return (
                    <td>
                      <div className="card z-depth-2" style={{ border: '2px solid #0000ff', padding: '0.5rem' }}>
                        <div className="card-title center-align"
                          style={{ fontSize: '1.2rem', fontWeight: '700', textTransform: 'uppercase' }}>
                          {AMShifts[shiftInd].building}
                        </div>
                        <hr style={{ width: '80%' }}></hr>
                        <div className="card-title center-align" style={{ fontSize: '1.2rem' }}>
                          <span>{AMShifts[shiftInd].startTime + ' - ' + AMShifts[shiftInd].endTime}</span>
                        </div>
                      </div>
                    </td>
                  )
                } else {
                  return <td></td>
                }
              })}
            </tr>
            <tr>
              <th>PM</th>
              {weekdays.map(day => {
                const shiftInd = afternoonShifts.map(s => s.weekDay).indexOf(day)
                if (shiftInd >= 0) {
                  return (
                    <td>
                      <div className="card z-depth-2" style={{ border: '2px solid #0000ff', padding: '0.5rem' }}>
                        <div className="card-title center-align"
                          style={{ fontSize: '1.2rem', fontWeight: '700', textTransform: 'uppercase' }}>
                          {afternoonShifts[shiftInd].building}
                        </div>
                        <hr style={{ width: '80%' }}></hr>
                        <div className="card-title center-align" style={{ fontSize: '1.2rem' }}>
                          <span>{afternoonShifts[shiftInd].startTime + ' - ' + afternoonShifts[shiftInd].endTime}</span>
                        </div>
                      </div>
                    </td>
                  )
                } else {
                  return <td></td>
                }
              })}
            </tr>
            <tr>
              <th>Show</th>
              {weekdays.map(day => {
                const shiftInd = showShifts.map(s => s.weekDay).indexOf(day)
                if (shiftInd >= 0) {
                  return (
                    <td>
                      <div className="card z-depth-2" style={{ border: '2px solid #0000ff', padding: '0.5rem' }}>
                        <div className="card-title center-align"
                          style={{ fontSize: '1.2rem', fontWeight: '700', textTransform: 'uppercase' }}>
                          {showShifts[shiftInd].building}
                        </div>
                        <hr style={{ width: '80%' }}></hr>
                        <div className="card-title center-align" style={{ fontSize: '1.2rem' }}>
                          <span>{showShifts[shiftInd].startTime + ' - ' + showShifts[shiftInd].endTime}</span>
                        </div>
                      </div>
                    </td>
                  )
                } else {
                  return <td></td>
                }
              })}
            </tr>
          </tbody>
        </table>
        <button className="right waves-effect waves-light btn-small"
          style={{ marginTop: '3rem', backgroundColor: '#0000ff' }}>Add to Google Calendar</button>
      </div>
    </>
  )
}

export default App