const fs = require('fs')
const csvParser = require('csv-parser')

let rows = []

fs.createReadStream("schedules/s6.csv").pipe(csvParser({headers: false})).on('data', row=>rows.push(row))

const valArr = (obj) => {
  return Array.from(Object.values(obj))
}

rows = rows.map(row=>valArr(row).map(cell=>cell.toLowerCase().trim())).filter(row=>!row.every(cell=>cell == ''))

let buildInds = {}

// make buildInds object with building name as key and starting index of building from rows 
for (let row of rows) {
  if (row[0]) {
  buildInds[row[0]] = rows.indexOf(row)
  }
}
// buildInds => { abravanel: 0, capitol: 12, 'delta hall': 14, rsbb: 30, rose: 35 }

let abravanel = []
let capitol = []
let delta = []
let rsbb = []
let rose = []

// iterate over slice from rows for each building and push those that slice to array for that building

// abravanel
for (let row of rows.slice(buildInds.abravanel, buildInds.capitol)) {
  if (row[0] == 'abravanel' || row[0] == '') {
    abravanel.push(row)
  } else {
    break
  }
}

// capitol
for (let row of rows.slice(buildInds.capitol, buildInds['delta hall'])) {
  if (row[0] == 'capitol' || row[0] == '') {
    capitol.push(row)
  } else {
    break
  }
}

// delta
for (let row of rows.slice(buildInds['delta hall'], buildInds.rsbb)) {
  if (row[0] == 'delta hall' || row[0] == '') {
    delta.push(row)
  } else {
    break
  }
}

// rsbb
for (let row of rows.slice(buildInds.rsbb, buildInds.rose)) {
  if (row[0] == 'rsbb' || row[0] == '') {
    rsbb.push(row)
  } else {
    break
  }
}

// rose
for (let row of rows.slice(buildInds.rose)) {
  if (row[0] == 'rose' || row[0] == '') {
    rose.push(row)
  } else {
    break
  }
}

// each building (abravanel, capitol, delta, rsbb, rose) is 2d array. Inner arrs are that buildings' rows from full sched csv
