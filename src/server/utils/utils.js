const dfns = require('date-fns')

// Make 2d Array from csvString ('asdf,asdf,"as, df",asdf' => [['asdf', 'asdf', 'as df', 'asdf']])
module.exports.parseCsv = csvString => {
  return csvString.split(/[\n\r]+/) // Split by newline or carriage return
    .map(rowStr => rowStr.replace(/"([\w\,\s]*)"/g, (_match, p1) => p1.replace(",", "")) // Remove "" marks and any commas within them
    .split(",").map(ent => ent.trim().toLowerCase()))
}

// Fill in blank Row headers with building
module.exports.fillRowHeaders = parsedCsv => {
  return parsedCsv
    .reduce((acc,curr,ind) => (curr[0] != '')
      ? acc.concat([curr])
      : acc.concat([[acc[ind-1][0], ...curr.slice(1)]]), [])
    .map(row => row.slice(0, 22))
}

module.exports.convertTo24Hour = parsedCsv => {
  let _parsedCsv = [...parsedCsv]
  let amPmSwitch
  for (let row = 0; row < _parsedCsv.length; row++) {
    if (typeof _parsedCsv[row][1] === 'string' && _parsedCsv[row][1].trim().match(/^(am|pm)$/)) {
      amPmSwitch = _parsedCsv[row][1] // Consider rows ahead to be AM or PM
    }
    for (let column = 2; column < _parsedCsv[row].length; column += 3)  {
      if (typeof _parsedCsv[row][column] === 'string' && _parsedCsv[row][column].match(/\d+:\d\d/)) {
        _parsedCsv[row][column] += amPmSwitch // append 'am' or 'pm' to all shift start-times.
      }
    }
  }
  return _parsedCsv
}

module.exports.dateHeadersToISO = parsedCsv => {
  // Make sure not an Invalid Date Object
  const isValidDate = date => (date instanceof Date && !isNaN(date)) ? true : false

  // Make ISO timestamps. 'monday august 9' year, hour, etc filled in with values from firstDayOfSchedule
  const formatDates = dateRow =>  {
    const startOfPresentWeek = dfns.startOfWeek(new Date(), {weekStartsOn: 1})
    const startOfNextWeek = dfns.addWeeks(startOfPresentWeek, 1)
    let firstDayOfSchedule = dfns.parse(dateRow[1], 'EEEE MMMM d', startOfNextWeek)
    if (firstDayOfSchedule < startOfNextWeek) {
      // In case new schedule is for two weeks out in new year (firstDayOfSchedule will be one year behind.)
      firstDayOfSchedule = dfns.addYears(firstDayOfSchedule, 1)
    }
    let _dateRow = dateRow.map(cell => {
      let _cell = dfns.parse(cell, 'EEEE MMMM d', firstDayOfSchedule) // EEEE MMMM d: day, month, day-of-month
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
          employeeName: (parsedCsv[row][cell - 1] === '') ? 'unknown' : parsedCsv[row][cell - 1],
          building: parsedCsv[row][0],
          startTime: dfns.parse(parsedCsv[row][cell], 'h:mmaa', parsedCsv[0][cell]),
          endTime: dfns.addHours(dfns.parse(parsedCsv[row][cell], 'h:mmaa', parsedCsv[0][cell]), (dfns.getHours(dfns.parse(parsedCsv[row][cell], 'h:mmaa', parsedCsv[0][cell])) > 16) ? 3 : 4) // If startTime is after 5,  assume 3 hour show shift. Otherwise, assume 4 hours.
        })
      }
    }
  }
  return shifts
}