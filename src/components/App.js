import React from 'react';

const App = () => {

  // Dummy Data
  const empSched = {
    shifts: [
      {
        building: 'Capitol',
        calDay: '2019-09-08',
        weekDay: 'monday',
        startTime: '13:45',
        endTime: '18:00'
      },
      {
        building: 'Regent Street',
        calDay: '2019-10-08',
        weekDay: 'tuesday',
        startTime: '09:45',
        endTime: '14:00'
      },
      {
        building: 'Abravanel',
        calDay: '2019-13-08',
        weekDay: 'thursday',
        startTime: '14:00',
        endTime: '18:00'
      },
      {
        building: 'Delta Hall',
        calDay: '2019-16-08',
        weekDay: 'sunday',
        startTime: '18:00',
        endTime: '21:00'
      }
    ]
  }

  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  // Doesn't work for multiple shifts in one day because find() / indexOf() return first match.
  return (
    <>
      <nav>
        <div className="nav-wrapper blue-grey darken-1 z-depth-3">
          <a href="#" className="brand-logo" style={{ marginLeft: '1.5rem' }}>zchedul_</a>
          <ul className="right">
          <li><a href="#">Your Schedule</a></li>
            <li><a href="#">Full Schedule</a></li>
            <li><a href="#">Logout</a></li>
          </ul>
        </div>
      </nav>

      <div className="container" style={{width: '90vw'}}>
        <div className="row blue-grey-text" style={{ borderBottom: '0.2em solid #78909c' }}>
          <h3 style={{ fontWeight: 500 }}>Your week</h3>
        </div>
        <table style={{tableLayout:'fixed'}}>
          <thead>
            <tr className="row blue-grey-text">
              <th style={{width: '14.28%'}}>Monday</th>
              <th style={{width: '14.28%'}}>Tuesday</th>
              <th style={{width: '14.28%'}}>Wednesday</th>
              <th style={{width: '14.28%'}}>Thursday</th>
              <th style={{width: '14.28%'}}>Friday</th>
              <th style={{width: '14.28%'}}>Saturday</th>
              <th style={{width: '14.28%'}}>Sunday</th>
            </tr>
          </thead>
          <tbody className="row">
            <tr>
              {weekdays.map(day => {
                const shiftInd = empSched.shifts.map(s=>s.weekDay).indexOf(day)
                if (shiftInd >= 0) {
                  return (
                    <td>
                      <div className="card blue-grey lighten-3 z-depth-2" style={{padding: '0.5rem'}}>
                        <div className="card-title center-align"
                          style={{color: '#892d2d', fontSize: '1.2rem', fontWeight: '500', textTransform:'uppercase'}}>
                            {empSched.shifts[shiftInd].building}
                        </div>
                        <hr style={{width: '80%'}}></hr>
                        <div className="card-title center-align" style={{fontSize: '1.2rem'}}>
                          <span>{empSched.shifts[shiftInd].startTime + ' - ' +  empSched.shifts[shiftInd].endTime}</span>
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
        <button className="right waves-effect waves-light btn-small blue-grey lighten-1"
          style={{ marginTop: '3rem' }}>Add to Google Calendar</button>
      </div>
    </>
  )
}

export default App