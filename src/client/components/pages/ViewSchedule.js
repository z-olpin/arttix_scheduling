import React from "react";
import { defineGridArea, to12Hour, toTitleCase } from "../../utils/utils";

const ViewSchedule = ({ shifts, weekdayColumnHeaders, timeRowHeaders }) => {

  return (
    <div id="container">
      <div id="week-slider">
        <button className="week-button">&#8592;</button>
        <h3 id='week-title'>This week</h3>
        <button className="week-button">&#8594;</button>
      </div>
      <div id="schedule">
        {/* TODO: This draws the horizontal lines. But no need to make a 62 spans, just make one for each line */}
        {[...Array(62).keys()].map(v =>
          <span style={{ borderTop: (v % 8) ? '0' : '1px solid rgba(0,0,0,0.3)', gridRow: v + 2, gridColumn: '1 / 9', width: '100%' }}></span>
        )}
        {weekdayColumnHeaders
          .map((day, i) =>
            <span className="column-title" id={day.toLowerCase()} style={{ gridRow: 1, gridColumn: i + 2 }}>
              {day}
            </span>
          )
        }
        {timeRowHeaders
          .map((time, i) =>
            <div className="time-row" style={{ gridRow: i * 8 + 2 + '/ span 8', gridColumn: 1 }}>
              {time.match(/\d{1,2}/)[0] + ' ' + time[time.length - 1].toUpperCase() + 'M'}
            </div>
          )
        }
        {shifts &&
          Object.values(shifts)
            .map(shift =>
              <div className='shift' style={{ gridArea: defineGridArea(shift) }}>
                <div>{toTitleCase(shift.building)}</div>
                <hr />
                <div style={{ display: 'block' }}>{`${to12Hour(shift.startHour)}:${shift.startMin}`} - {`${to12Hour(shift.endHour)}:${shift.endMin}`}</div>
                <hr />
                <div style={{ display: 'block', position: 'absolute', bottom: 0, left: 0, margin: '1rem', fontStyle: 'italic', fontSize: '1rem' }}>{shift.notes ? `${shift.notes}` : undefined}</div>
              </div>
            )
        }
      </div>
    </div>
  )
}

export default ViewSchedule