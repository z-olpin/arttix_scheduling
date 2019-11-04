import React from "react";
import { Link } from "react-router-dom";
import { toTitleCase } from "../../utils/utils";

const Header = ({handleUserChange, employees}) => {

  return (
    <nav id="navbar" style={{ marginBottom: '1rem', backgroundColor: '#41433A' }}>
      <Link to="/index.html" id="logo" style={{ marginLeft: '1.5rem' }}>zchedule_</Link>
      <Link to='/upload'>Upload</Link>
      <Link to='/create'>Create</Link>
      <Link to="/index.html">View</Link>
      <div>
        <label htmlFor="user-input" style={{marginRight: '1rem'}}>User:</label>
        <select id="user-input" onChange={handleUserChange}>
          <option selected></option>
          {employees.map(e => <option value={e}>{toTitleCase(e)}</option>)}
        </select>
      </div>
    </nav>
  )
}

export default Header