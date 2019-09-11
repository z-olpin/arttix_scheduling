import React from 'react';

const App = () => {
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
            <td>
              <div className="card blue-grey lighten-3 z-depth-2" style={{padding: '0.5rem'}}>
                <div className="card-title center-align" style={{color: '#892d2d', fontSize: '1.2rem', fontWeight: '500', textTransform:'uppercase'}}>Delta Hall</div>
                <hr style={{width: '80%'}}></hr>
                <div className="card-title center-align" style={{fontSize: '1.2rem'}}><span>9:00 &ndash; 2:00</span></div>
              </div>
            </td>
            <td>
            <div className="card blue-grey lighten-3 z-depth-2" style={{padding: '0.5rem'}}>
                <div className="card-title center-align" style={{color: '#892d2d', fontSize: '1.2rem', fontWeight: '500', textTransform:'uppercase'}}>Capitol</div>
                <hr style={{width: '80%'}}></hr>
                <div className="card-title center-align" style={{fontSize: '1.2rem'}}><span>9:45 &ndash; 6:00</span></div>
              </div>
            </td>
            <td>
            <div className="card blue-grey lighten-3 z-depth-2" style={{padding: '0.5rem'}}>
                <div className="card-title center-align" style={{color: '#892d2d', fontSize: '1.2rem', fontWeight: '500', textTransform:'uppercase'}}>Rose Wagner</div>
                <hr style={{width: '80%'}}></hr>
                <div className="card-title center-align" style={{fontSize: '1.2rem'}}><span>5:00 &ndash; 8:00</span></div>
              </div>
            </td>
            <td>

            </td>
            <td>
            <div className="card blue-grey lighten-3 z-depth-2" style={{padding: '0.5rem'}}>
                <div className="card-title center-align" style={{color: '#892d2d', fontSize: '1.2rem', fontWeight: '500', textTransform:'uppercase'}}>Delta Hall</div>
                <hr style={{width: '80%'}}></hr>
                <div className="card-title center-align" style={{fontSize: '1.2rem'}}><span>9:45 &ndash; 2:00</span></div>
              </div>
            </td>
            <td>
            <div className="card blue-grey lighten-3 z-depth-2" style={{padding: '0.5rem'}}>
                <div className="card-title center-align" style={{color: '#892d2d', fontSize: '1.2rem', fontWeight: '500', textTransform:'uppercase'}}>Abravanel</div>
                <hr style={{width: '80%'}}></hr>
                <div className="card-title center-align" style={{fontSize: '1.2rem'}}><span>1:45 &ndash; 6:00</span></div>
              </div>
            </td>
            <td>

            </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
              <div className="card blue-grey lighten-3 z-depth-2" style={{padding: '0.5rem'}}>
                <div className="card-title center-align" style={{color: '#892d2d', fontSize: '1.2rem', fontWeight: '500', textTransform:'uppercase'}}>Rose Wagner</div>
                <hr style={{width: '80%'}}></hr>
                <div className="card-title center-align" style={{fontSize: '1.2rem'}}><span>2:30 &ndash; 6:00</span></div>
              </div>
              </td>
              <td></td>
              <td></td>

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