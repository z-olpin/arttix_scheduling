export const parseCsv = csvString => {
  return csvString.split(/[\n\r]+/) // Split by newline or carriage return
    .map(rowStr => rowStr.replace(/"([\w\,\s]*)"/g, (_match, p1) => p1.replace(",", "")) // Remove "" marks and any commas within them
    .split(",").map(ent => ent.trim().toLowerCase()))
}

export const fillRowHeaders = parsedCsv => {
  return parsedCsv
    .reduce((acc,curr,ind) => (curr[0] != '')
      ? acc.concat([curr])
      : acc.concat([[acc[ind-1][0], ...curr.slice(1)]]), [])
    .map(row => row.slice(0, 22))
}

export const convertTo24Hour = parsedCsv => {

  const getAmPm = (csv, rowNum, colNum) => {
    let _csv = [...csv]
    let _rowNum = rowNum - 1
    let _colNum = colNum - 1
    if (_csv[_rowNum][_colNum].match(/AM|PM|am|pm/)) {
      return _csv[_rowNum][_colNum].match(/AM|PM|am|pm/)[0]
    } else {
      return getAmPm(_csv, _rowNum, _colNum+1)
    }
  }

  let _parsedCsv = [...parsedCsv]

  for (let row = 0; row < _parsedCsv.length; row++) {
    for (let column = 2; column < _parsedCsv[row].length; column += 3)  {
      if (_parsedCsv[row][column].match(/\d+:\d\d/)) {
        _parsedCsv[row][column] += getAmPm(_parsedCsv, row, column)
      }
    }
  }
  return _parsedCsv
}
