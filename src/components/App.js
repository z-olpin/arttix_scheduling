import React from 'react';

const App = () => {
  return (
    <>
      <nav>
        <div class="nav-wrapper blue-grey darken-1">
          <a href="#" class="brand-logo" style={{ marginLeft: '1.5rem' }}>zchedul_</a>
          <ul class="right">
            <li><a href="#">Full Schedule</a></li>
            <li><a href="#">Logout</a></li>
          </ul>
        </div>
      </nav>
      <div className="container">
        <div className="row blue-grey-text" style={{ borderBottom: '0.2em solid #78909c' }}>
          <h3 style={{ fontWeight: 500 }}>Your week</h3>
        </div>
        <table>
          <thead>
            <tr className="blue-grey-text">
              <th>BUILDING</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
              <th>Saturday</th>
              <th>Sunday</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <th>Capitol</th>
              <td></td>
              <td>9 &ndash; 2</td>
              <td>2 &ndash; 8</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <th>Delta Hall</th>
              <td>9 &ndash; 2</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <th>Abravanel</th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>9 &ndash; 2</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <th>Rose Wagner</th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <th>Regent Street</th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>9 &ndash; 2</td>
            </tr>
          </tbody>
        </table>
        <button class="right waves-effect waves-light btn-small blue-grey lighten-1"
          style={{ marginTop: '3rem' }}>Add to Google Calendar</button>
      </div>
    </>
  )
}

export default App