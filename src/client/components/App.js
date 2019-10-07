import React, { useState } from 'react';

const App = () => {
  const [user, setUser] = useState('')
  const [suggestions, setSuggestions] = useState(['zach', 'alice', 'bob', 'charlie'])
  const [shifts, setShifts] = useState([])
  
  const handleUserChange = e => {
    e.preventDefault()
    setUser(e.target.value)
  }

  const getShifts = e => {
    e.preventDefault()
    fetch(`http://localhost:5000/employees/${user}/shifts`, {method: 'GET'})
    .then(r=>r.json()).then(j => setShifts(j))
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
      <div>{(shifts.length >= 1) ? shifts.map(shift => <ul><li>{shift.name}</li><li>{shift.start}</li><li>{shift.end}</li></ul>) : <></>}</div>
      <button onClick={getShifts}>Get Shifts</button>
      
    </>
  )
}

export default App