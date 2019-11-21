const dfns = require('date-fns')

module.exports.parseCsv = csvString => {
  return csvString.split(/[\n\r]+/) // Split by newline or carriage return
    .map(rowStr => rowStr.replace(/"([\w\,\s]*)"/g, (_match, p1) => p1.replace(",", "")) // Remove "" marks and any commas within them
    .split(",").map(ent => ent.trim().toLowerCase()))
}

module.exports.fillRowHeaders = parsedCsv => {
  // Fill in blank Row headers with building
  return parsedCsv
    .reduce((acc,curr,ind) => (curr[0] != '')
      ? acc.concat([curr])
      : acc.concat([[acc[ind-1][0], ...curr.slice(1)]]), [])
    .map(row => row.slice(0, 22))
}

module.exports.convertTo24Hour = parsedCsv => {

  // Find cells with times (9:45) and figure out whether they are meant to be AM or PM
  // by looking one column left and up until necessary.
  const getAmPm = (csv, rowNum, colNum) => {
    let _csv = [...csv]
    let _rowNum = rowNum - 1
    let _colNum = colNum - 1
    if (typeof _csv[_rowNum][_colNum] === 'string' && _csv[_rowNum][_colNum].match(/AM|PM|am|pm/)) {
      return _csv[_rowNum][_colNum].match(/AM|PM|am|pm/)[0]
    } else {
      return getAmPm(_csv, _rowNum, _colNum+1)
    }
  }

  let _parsedCsv = [...parsedCsv]

  // append am or pm to times
  for (let row = 0; row < _parsedCsv.length; row++) {
    for (let column = 2; column < _parsedCsv[row].length; column += 3)  {
      if (typeof _parsedCsv[row][column] === 'string' && _parsedCsv[row][column].match(/\d+:\d\d/)) {
        _parsedCsv[row][column] += getAmPm(_parsedCsv, row, column)
      }
    }
  }
  return _parsedCsv
}

module.exports.dateHeadersToISO = parsedCsv => {
  // Make sure not and Invalid Date Date Object
  const isValidDate = date => (date instanceof Date && !isNaN(date)) ? true : false

  // Make ISO timestamps. 'monday august 9' year, hour, etc filled in with values from new Date() (now)
  const formatDates = dateRow =>  {
    let _dateRow = dateRow.map(cell => {
      let _cell = dfns.parse(cell, 'EEEE MMMM d', new Date()) // EEEE MMMM d: day, month, day-of-month
      if (isValidDate(_cell)) {
        return _cell
      } else {
        return cell
      }
    // Fill in blank column headers with appropriate dates
    }).reduce((a,c,i) => (c === '') ? [...a, a[i-1]] : [...a, c] , [])
    return _dateRow
  }
  
  return parsedCsv.map(row => {
    if (row[0] !== '') {
      return formatDates(row)
    } else {
      return row
    }
  })
}

module.exports.makeShiftObjs = parsedCsv => {
  // Look through cells for times (9:45am) and make an object from them using
  // row header (buildingName), column header + cell (startTime), column header (date), and
  // previous cell (employee name)
  let shifts = []
  for (let row = 0; row < parsedCsv.length ; row++) {
    for (let cell = 0; cell < parsedCsv[row].length; cell++) {
      if (typeof parsedCsv[row][cell] === 'string' && parsedCsv[row][cell].match(/^\d+:\d\d(am|pm)$/)) {
        shifts.push({
          employeeName: parsedCsv[row][cell - 1],
          startTime: dfns.parse(parsedCsv[row][cell], 'h:mmaa', parsedCsv[0][cell]),
          building: parsedCsv[row][0],
          date: parsedCsv[0][cell]
        })
      }
    }
  }
  return shifts
}