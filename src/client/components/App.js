import React, { useState, useEffect } from 'react';
import '../../public/index.css';

const App = () => {
  const [user, setUser] = useState('')
  const [suggestions, setSuggestions] = useState(['Zach', 'Alice', 'Bob', 'Charlie', 'Doug'])
  const [shifts, setShifts] = useState()

  useEffect(() => {
    fetch(`http://localhost:5000/employees/${user}/shifts`, {method: 'GET'})
    .then(r => r.json())
    .then(r => setShifts(r))
  }, [user])
  
  const handleUserChange = e => {
    e.preventDefault()
    setUser(e.target.value.slice(0,1).toLowerCase() + e.target.value.slice(1))
  }

  return (
    <>
      <nav style={{ marginBottom: '1rem', backgroundColor: 'rgb(0,0,255)' }}>
        <div >
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
        <button id='week-left'>&#8592;</button>
        <h3 id='week-title'>This week</h3>
        <button id='week-right'>&#8594;</button>
      </div>
      <div id="schedule">
        {
          ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            .map(day => <div class="column-title" id={day.toLowerCase()}>{day}</div>)
        }
        {
          ['8a', '10a', '12p', '2p', '4p', '6p', '8p']
            .map(time =>
              <div id={'time' + time}>
                {time.match(/\d{1,2}/)[0] + ' ' + time[time.length-1].toUpperCase() + 'M'}
              </div>
            )
        }
        {
          shifts && shifts.map(shift => <div class='shift' id={'shift' + shift.shift_id}>
              {shift.building.split(' ').map(w => w.slice(0,1).toUpperCase() + w.slice(1)).join(' ')}
              <p></p>
              {shift.start.match(/\d\d\:\d\d/)[0]} - {shift.end.match(/\d\d\:\d\d/)[0]}
            </div>
          )
        }
      </div>      
    </>
  )
}

export default App