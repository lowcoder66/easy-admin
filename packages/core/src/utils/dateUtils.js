import moment from "moment"

const defaultInvalid = null

export const parseDate = (time, invalid = defaultInvalid) => {
  let m = moment(time)
  return m.isValid() ? m.toDate() : invalid
}

export const parseTimestamp = (time, invalid = defaultInvalid) => {
  let m = moment(time)
  return m.isValid() ? m.valueOf() : invalid
}

export const add = (time, amount, unit, invalid = defaultInvalid) => {
  let m = moment(time)
  return m.isValid() ? m.add(amount, unit).toDate() : invalid
}
export const subtract = (time, amount, unit, invalid = defaultInvalid) => {
  let m = moment(time)
  return m.isValid() ? m.subtract(amount, unit).toDate() : invalid
}

export const compare = (timeA, timeB, invalid = defaultInvalid) => {
  let ma = moment(timeA),
    mb = moment(timeB)
  if (ma.isValid() && mb.isValid()) {
    return ma.isSame(mb) ? 0 : ma.isBefore(mb) ? -1 : 1
  } else {
    return invalid
  }
}

export const formatDateTime = (date, pattern = "YYYY-MM-DD HH:mm:ss", invalid = "") => {
  let m = moment(date)
  return m.isValid() ? m.format(pattern) : invalid
}

export const formatDate = (date, pattern = "YYYY-MM-DD", invalid = "") => {
  return formatDateTime(date, pattern, invalid)
}
