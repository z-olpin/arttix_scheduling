import React, { useState, useEffect } from 'react';
import empSched from "../empSched";

const App = () => {
  const [user, setUser] = useState('')
  const [userShifts, setUserShifts] = useState([])

  useEffect(() => setUserShifts([...empSched.shifts.filter(s => s.employee == user)]), [user])

  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  // Doesn't work for multiple shifts in one day because find() / indexOf() return first match.
  return (
    <>
      <nav style={{ marginBottom: '1rem' }}>
        <div className="nav-wrapper z-depth-3" style={{backgroundColor: "#0000ff"}}>
          <a href="#" className="brand-logo" style={{ marginLeft: '1.5rem' }}>zchedul_</a>
          <ul className="right valign-wrapper" style={{ marginRight: '1.2rem' }}>
            <li>
              <div style={{ marginRight: '1.2rem' }}>USER:</div>
            </li>
            <li>
              <select onChange={e => setUser(e.target.value)} className="browser-default" style={{ color: '#ffffff', backgroundColor: 'transparent' }}>
                <option value="" selected></option>
                <option value="zach">Zach</option>
                <option value="ana">Ana</option>
                <option value="bob">Bob</option>
              </select>
            </li>
          </ul>
        </div>
      </nav>


      <div className="container" style={{ width: '90vw' }}>
        <div className="row" style={{ color: '#0000ff', borderBottom: '0.2em solid #0000ff' }}>
          <h3 style={{ fontWeight: 500 }}>Your week</h3>
        </div>
        <table style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr className="row">
              <th style={{ width: '14.28%' }}>Monday</th>
              <th style={{ width: '14.28%' }}>Tuesday</th>
              <th style={{ width: '14.28%' }}>Wednesday</th>
              <th style={{ width: '14.28%' }}>Thursday</th>
              <th style={{ width: '14.28%' }}>Friday</th>
              <th style={{ width: '14.28%' }}>Saturday</th>
              <th style={{ width: '14.28%' }}>Sunday</th>
            </tr>
          </thead>
          <tbody className="row">
            <tr>
              {weekdays.map(day => {
                const shiftInd = userShifts.map(s => s.weekDay).indexOf(day)
                if (shiftInd >= 0) {
                  return (
                    <td>
                      <div className="card z-depth-2" style={{ border: '2px solid #0000ff', padding: '0.5rem' }}>
                        <div className="card-title center-align"
                          style={{fontSize: '1.2rem', fontWeight: '700', textTransform: 'uppercase' }}>
                          {userShifts[shiftInd].building}
                        </div>
                        <hr style={{ width: '80%' }}></hr>
                        <div className="card-title center-align" style={{ fontSize: '1.2rem' }}>
                          <span>{userShifts[shiftInd].startTime + ' - ' + userShifts[shiftInd].endTime}</span>
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
          style={{ marginTop: '3rem', backgroundColor: '#0000ff'}}>Add to Google Calendar</button>
      </div>
    </>
  )
}

export default App