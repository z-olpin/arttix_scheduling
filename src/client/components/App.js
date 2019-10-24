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

  const toTitleCase = str => {
    return str.split(' ').map(w => w[0].toUpperCase().concat(w.slice(1))).join(' ')
  }

  const to12Hour = hour => {
    if (typeof hour == 'string') {
      let _hour = parseInt(hour)
      return (_hour > 12) ? _hour - 12 : _hour
    } else {
      return (hour > 12) ? hour - 12 : hour
    }
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
      _shift.comparisonStart = parseInt(format(startDate, 'yyyyMMddHHmm'))
      _shift.comparisonEnd = parseInt(format(endDate, 'yyyyMMddHHmm'))
      _shift.notes = undefined
      return _shift
    })

    
    const shiftObj = {}
    _rows.map(shift => (shiftObj[shift.date]) ? shiftObj[shift.date].push(shift) : shiftObj[shift.date] = [shift])
    
    
    let shiftObjShifts = Object.values(shiftObj).map(shift => {
      switch(shift.length) {
        case 1:
          return shift
          break
        case 2:
          if (shift[1].comparisonStart < shift[0].comparisonEnd) {
            let _shift = {...shift[0]}
            _shift.end = shift[1].end
            _shift.endHour = shift[1].endHour
            _shift.endMin = shift[1].endMin
            _shift.notes = (shift[0].building_id !== shift[1].building_id) ? `*To ${toTitleCase(shift[1].building)} at ${to12Hour(shift[1].startHour) + ':' + shift[1].startMin}`: undefined
            return [_shift]
          } else {
            return shift
          }
          break
        case 3:
          let _sshift = {...shift[0]}
          _sshift.end = shift[2].end
          _sshift.endHour = shift[2].endHour
          _sshift.endMin = shift[2].endMin
          let buildingIds = [shift[0].building_id, shift[1].building_id, shift[1].building_id]
          let buildingId = buildingIds.filter(b => b !== buildingIds[0])[0]
          let switchShift = [shift[0], shift[1], shift[2]].find(s => s.building_id == buildingId)
          _sshift.notes = (shift[0].building_id !== shift[1].building_id || shift[0].building_id !== shift[2].building_id) ? `*To ${toTitleCase(shift[2].building)} at ${to12Hour(switchShift.startHour) + ':' + switchShift.startMin}`: undefined
          return [_sshift]
          break
        default:
          return 'no matching case'
          break
      }
    })
    let newObj = {}
    shiftObjShifts.map(shiftARR => shiftARR.map(shift => newObj[shift.comparisonStart] = shift))
    return newObj
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
      <nav id="navbar" style={{ marginBottom: '1rem', backgroundColor: '#41433A' }}>
          <a href="#" id="logo" style={{ marginLeft: '1.5rem' }}>zchedul_</a>
              <select id="user-input" onChange={handleUserChange}>
                <option selected>User:</option>
                <option>Zach</option>
                <option>Alice</option>
                <option>Bob</option>
                <option>Charlie</option>
                <option>Doug</option>
              </select>
      </nav>
      <div id="container">
      <div id="week-slider">
        <button className="week-button">&#8592;</button>
        <h3 id='week-title'>This week</h3>
        <button className="week-button">&#8594;</button>
      </div>
        <div id="sidebar"></div>
        <div id="schedule">
          {[...Array(62).keys()].map(v =>
            <span style={{ borderTop: (v % 8) ? '0' : '1px solid rgba(0,0,0,0.3)', gridRow: v + 2, gridColumn: '1 / 9', width: '100%' }}></span>
          )}

          {weekdayColumnHeaders
            .map((day, i) => <span className="column-title" id={day.toLowerCase()} style={{ gridRow: 1, gridColumn: i + 2 }}>{day}</span>)}

          {timeRowHeaders
            .map(time => <div className="time-row" id={'time' + time}>{time.match(/\d{1,2}/)[0] + ' ' + time[time.length - 1].toUpperCase() + 'M'}</div>)}

          {shifts &&
            Object.values(shifts)
            .map(shift =>
              <div className='shift' style={{ gridArea: defineGridArea(shift) }}>
                <div>{toTitleCase(shift.building)}</div>
                <hr></hr>
                <div style={{display: 'block'}}>{`${to12Hour(shift.startHour)}:${shift.startMin}`} - {`${to12Hour(shift.endHour)}:${shift.endMin}`}</div>
                <hr></hr>
                <div style={{display: 'block', position: 'absolute', bottom: 0, left: 0, margin: '1rem', fontStyle: 'italic', fontSize: '1rem'}}>{shift.notes ? `${shift.notes}` : undefined}</div>
              </div>
            )
          }
        </div>
      </div>
    </>
  )
}

export default App