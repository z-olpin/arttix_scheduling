import React from "react"
import { toTitleCase } from "../../utils/utils";

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
                      {employees.map(emp => <option value={emp}>{toTitleCase(emp)}</option>)}
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