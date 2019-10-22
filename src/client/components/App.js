import React, { useState, useEffect } from 'react';
import '../../public/index.css';

const App = () => {
  const [user, setUser] = useState()
  const [suggestions, setSuggestions] = useState(['Zach', 'Alice', 'Bob', 'Charlie', 'Doug'])
  const [shifts, setShifts] = useState([])
  const WEEKDAY_COLUMNS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const TIME_ROWS = ['8a', '10a', '12p', '2p', '4p', '6p', '8p']

  useEffect(() => {
    fetch(`http://localhost:5000/employees/${user}/shifts`, {method: 'GET'})
    .then(r => r.json())
    .then(rows => groupShiftsByDay(rows))
    .then(r => setShifts(r))
  }, [user])
  
  const handleUserChange = e => {
    e.preventDefault()
    setUser(e.target.value.slice(0,1).toLowerCase() + e.target.value.slice(1))
  }

  const groupShiftsByDay = (rows) => {
    let _shifts = []
    Array.from(new Set(rows.map(row => row.doy))).map(doy => _shifts.push(rows.filter(row => row.doy == doy)))
    return _shifts
  }

  return (
    <>
      <nav style={{ marginBottom: '1rem', backgroundColor: '#41433A' }}>
        <div>
          <a href="#" className="brand-logo" style={{ marginLeft: '1.5rem' }}>zchedul_</a>
          <ul className="right valign-wrapper" style={{ marginRight: '1.2rem' }}>
            <li>
              <div style={{ marginRight: '1.2rem' }}>USER:</div>
            </li>
            <li>
              <input id="user-input" type="select" onChange={handleUserChange} list="suggestions">
              </input>
              <datalist id="suggestions">
                {suggestions.map(s => <option value={s}></option>)}
              </datalist>
            </li>
          </ul>
        </div>
      </nav>
      <div id="week-slider">
        <button className="week-button">&#8592;</button>
        <h3 id='week-title'>This week</h3>
        <button className="week-button">&#8594;</button>
      </div>
      <div id="schedule">
        {WEEKDAY_COLUMNS
          .map(day => <div className="column-title" id={day.toLowerCase()}>{day}</div>)}
        {TIME_ROWS
          .map(time => <div id={'time' + time}>{time.match(/\d{1,2}/)[0] + ' ' + time[time.length-1].toUpperCase() + 'M'}</div>)}
        {shifts && shifts
          .map(day => 
            <div className={'shift ' + day[0].dow} style={{gridRow: day[0].gridStart + ' / ' + day[day.length-1].gridEnd}}>
                {day[0].building.split(' ').map(w => w.slice(0,1).toUpperCase() + w.slice(1)).join(' ')}
              <p></p>
                {`
                  ${(day[0].start_hour > 12)
                    ? day[0].start_hour - 12
                    : day[0].start_hour}:${day[0].start_min}`} - {`${(day[day.length-1].end_hour > 12)
                      ? day[day.length-1].end_hour - 12
                      : day[day.length-1].end_hour}:${day[day.length-1].end_min}
                `}
            </div>
          )
        }
      </div>      
    </>
  )
}

export default App