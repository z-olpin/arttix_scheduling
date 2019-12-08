import { format } from "date-fns";

export const toTitleCase = str => {
  return str.split(' ').map(w => w[0].toUpperCase().concat(w.slice(1))).join(' ')
}

export const to12Hour = hour => {
  if (typeof hour == 'string') {
    let _hour = parseInt(hour)
    return (_hour > 12) ? _hour - 12 : _hour
  } else {
    return (hour > 12) ? hour - 12 : hour
  }
}

// TODO: Fix this mess.
// Formats shift values and combines shifts with overlapping start/end times
export const formatShifts = (rows) => {
  let _rows = rows.map(shift => {
    const _shift = { ...shift }
    const startDate = new Date(_shift.start)
    const endDate = new Date(_shift.end)
    _shift.date = format(startDate, 'yyyyMMdd')
    _shift.day = format(startDate, 'EEEE')
    _shift.dow = format(startDate, 'i')
    _shift.startHour = format(startDate, 'H')
    _shift.startMin = format(startDate, 'mm')
    _shift.endHour = format(endDate, 'H')
    _shift.endMin = format(endDate, 'mm')
    _shift.comparisonStart = parseInt(format(startDate, 'yyyyMMddHHmm'))
    _shift.comparisonEnd = parseInt(format(endDate, 'yyyyMMddHHmm'))
    _shift.notes = undefined
    return _shift
  })

  
  const shiftObj = {}
  _rows.map(shift => (shiftObj[shift.date]) ? shiftObj[shift.date].push(shift) : shiftObj[shift.date] = [shift])
  
  
  let shiftObjShifts = Object.values(shiftObj).map(shift => {
    // Combine multiple shifts into one.
    switch(shift.length) {
      case 1:
        return shift
      case 2:
        if (shift[1].comparisonStart < shift[0].comparisonEnd) {
          let _shift = {...shift[0]}
          _shift.end = shift[1].end
          _shift.endHour = shift[1].endHour
          _shift.endMin = shift[1].endMin
          _shift.notes = (shift[0].building_id !== shift[1].building_id) ? `*To ${toTitleCase(shift[1].building)} at ${to12Hour(shift[1].startHour) + ':' + shift[1].startMin}`: undefined
          return [_shift]
        } else {
          return shift
        }
      case 3:
        let _sshift = {...shift[0]}
        _sshift.end = shift[2].end
        _sshift.endHour = shift[2].endHour
        _sshift.endMin = shift[2].endMin
        let buildingIds = [shift[0].building_id, shift[1].building_id, shift[1].building_id]
        let buildingId = buildingIds.filter(b => b !== buildingIds[0])[0]
        let switchShift = [shift[0], shift[1], shift[2]].find(s => s.building_id == buildingId)
        _sshift.notes = (shift[0].building_id !== shift[1].building_id || shift[0].building_id !== shift[2].building_id) ? `*To ${toTitleCase(shift[2].building)} at ${to12Hour(switchShift.startHour) + ':' + switchShift.startMin}`: undefined
        return [_sshift]
      default:
        return shift
    }
  })
  let newShiftObj = {}
  shiftObjShifts.map(shiftArr => shiftArr.map(shift => newShiftObj[shift.comparisonStart] = shift))
  return newShiftObj
}

// Get values to appropriately position a shift in UI
export const defineGridArea = shift => {
  const rowStart = (parseInt(shift.startHour) - 8) * 4 + (parseInt(shift.startMin) / 15) + 2
  const columnStart = parseInt(shift.dow) + 1
  const rowEnd = (parseInt(shift.endHour) - 8) * 4 + (parseInt(shift.endMin) / 15) + 2
  const columnEnd = columnStart
  return `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`
}

