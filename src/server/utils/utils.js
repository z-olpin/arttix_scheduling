const dfns = require('date-fns')

module.exports.parseCsv = csvString => {
  return csvString.split(/[\n\r]+/) // Split by newline or carriage return
    .map(rowStr => rowStr.replace(/"([\w\,\s]*)"/g, (_match, p1) => p1.replace(",", "")) // Remove "" marks and any commas within them
    .split(",").map(ent => ent.trim().toLowerCase()))
}

module.exports.fillRowHeaders = parsedCsv => {
  return parsedCsv
    .reduce((acc,curr,ind) => (curr[0] != '')
      ? acc.concat([curr])
      : acc.concat([[acc[ind-1][0], ...curr.slice(1)]]), [])
    .map(row => row.slice(0, 22))
}

module.exports.convertTo24Hour = parsedCsv => {

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

  for (let row = 0; row < _parsedCsv.length; row++) {
    for (let column = 2; column < _parsedCsv[row].length; column += 3)  {
      if (typeof _parsedCsv[row][column] === 'string' && _parsedCsv[row][column].match(/\d+:\d\d/)) {
        _parsedCsv[row][column] += getAmPm(_parsedCsv, row, column)
      }
    }
  }
  return _parsedCsv
}

// Get date of first cell containing date (A2)
module.exports.dateHeadersToISO = parsedCsv => {

  const isValidDate = date => (date instanceof Date && !isNaN(date)) ? true : false

  const formatDates = dateRow =>  {
    let _dateRow = dateRow.map(cell => {
      let _cell = dfns.parse(cell, 'EEEE MMMM d', new Date())
      if (isValidDate(_cell)) {
        return _cell
      } else {
        return cell
      }
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