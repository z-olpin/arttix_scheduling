import React from "react"

const CreateSchedule = ({weekdayColumnHeaders, buildings, employees}) => {

  return (
    <>
      <table>
        <thead>
          <tr>
            <th></th>
            {weekdayColumnHeaders.map(day => <th>{day}</th>)}
          </tr>
        </thead>
        <tbody>
          {buildings.map(b =>
            <tr>
              <th>{b}</th>
              {weekdayColumnHeaders.map(_ =>
                <td>
                  <div>
                    <select>
                      <option selected>Employee</option>
                      {employees.map(emp => <option>{emp}</option>)}
                    </select>
                    <input></input>
                    <input></input>
                  </div>
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

export default CreateSchedule