import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek } from "date-fns";
import '../../public/index.css';

const App = () => {
  const [user, setUser] = useState()
  const [suggestions, setSuggestions] = useState(['Zach', 'Alice', 'Bob', 'Charlie', 'Doug'])
  const [shifts, setShifts] = useState()

  const presentMonday = format(startOfWeek(Date.now(), { weekStartsOn: 1 }), 'yyyyMMdd')
  const presentSunday = format(endOfWeek(Date.now(), { weekStartsOn: 1 }), 'yyyyMMdd')
  const weekdayColumnHeaders = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const timeRowHeaders = ['8a', '10a', '12p', '2p', '4p', '6p', '8p']

  useEffect(() => {
    fetch(`http://localhost:5000/employees/${user}/shifts`, { method: 'GET' })
      .then(r => r.json())
      .then(rows => formatShifts(rows))
      .then(r => setShifts(r))
  }, [user])

  const handleUserChange = e => {
    e.preventDefault()
    setUser(e.target.value.slice(0, 1).toLowerCase() + e.target.value.slice(1))
  }

  const formatShifts = (rows) => {
    let _rows = rows.map(shift => {
      const _shift = { ...shift }
      const startDate = new Date(_shift.start)
      const endDate = new Date(_shift.end)
      _shift.date = format(startDate, 'yyyyMMdd')
      _shift.day = format(startDate, 'EEEE')
      _shift.dow = format(startDate, 'i')
      _shift.startHour = format(startDate, 'H')
      _shift.startMin = format(startDate, 'mm')
      _shift.endHour = format(endDate, 'H')
      _shift.endMin = format(endDate, 'mm')
      return _shift
    })

    const shiftObj = {}
    _rows.map(shift => (shiftObj[shift.date]) ? shiftObj[shift.date].push(shift) : shiftObj[shift.date] = [shift])

    return shiftObj

  }

  const defineGridArea = shift => {
    const rowStart = (parseInt(shift.startHour) - 8) * 4 + (parseInt(shift.startMin) / 15) + 2
    const columnStart = parseInt(shift.dow) + 1
    const rowEnd = (parseInt(shift.endHour) - 8) * 4 + (parseInt(shift.endMin) / 15) + 2
    const columnEnd = columnStart
    return `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`
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
        {[...Array(62).keys()].map(v =>
          <span style={{ borderTop: (v % 8) ? '0' : '1px solid rgba(0,0,0,0.3)', gridRow: v + 2, gridColumn: '1 / 9', width: '100%' }}></span>
        )}

        {weekdayColumnHeaders
          .map((day, i) => <span className="column-title" id={day.toLowerCase()} style={{ gridRow: 1, gridColumn: i + 2 }}>{day}</span>)}

        {timeRowHeaders
          .map(time => <div className="time-row" id={'time' + time}>{time.match(/\d{1,2}/)[0] + ' ' + time[time.length - 1].toUpperCase() + 'M'}</div>)}

        {shifts &&
          Object.values(shifts).map(day =>
            day.map(shift =>
              <div className='shift' style={{ gridArea: defineGridArea(shift) }}>
                {shift.building.split(' ').map(w => w[0].toUpperCase().concat(w.slice(1))).join(' ')}
                <p />
                {`${shift.startHour}:${shift.startMin}`} - {`${shift.endHour}:${shift.endMin}`}
              </div>
            )
          )
        }
      </div>
    </>
  )
}

export default App