import React from "react";

const UploadSchedule = ({fileUpload, newSchedule}) =>  {

  return (
    <>
    <form id="file-upload" name="file-upload" onSubmit={fileUpload}>
    <label htmlFor='file-upload'>Upload a new schedule (.csv): </label>
    <input id="fileInput" type="file" name="file" />
    <input type="submit" value="Upload"/>
    </form>
    {newSchedule &&
    <table>
      <tbody>
        {newSchedule.map(row => <tr>{row.map(ent => <td>{ent}</td>)}</tr>)}
      </tbody>
    </table>
    }
    </>
  )
}

export default UploadSchedule