import React, { useState } from "react"

const UploadSchedule = () =>  {

  const [newSchedule, setNewSchedule] = useState()

  const fileUpload = e => {
    e.preventDefault();
    const formData = new FormData();
    const fileField = document.querySelector('input[type="file"]')
    formData.append('file', fileField.files[0])
    fetch('http://localhost:5000/uploadFile', { method: 'POST', body: formData })
      .then(r => r.json())
      .then(r => setNewSchedule(r))
  }

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