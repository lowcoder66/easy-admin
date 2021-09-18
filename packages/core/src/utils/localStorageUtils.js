export const readObject = (key, def = null)  => {
  let value = localStorage.getItem(key)
  let obj = def;
  try {
    if(typeof value === 'string' && ((value.startsWith("{") && value.endsWith("}")) || (value.startsWith("[") && value.endsWith("]")))) {
      obj = JSON.parse(value);
    } else {
      obj = value
    }
  } catch (e) {
    console.warn("Can't read object from localStorage, key: " + key)
  }

  return obj;
}

export const writeObject = (key, obj)  => {
  let finalValue = obj
  if (typeof obj === 'object') {
    finalValue = JSON.stringify(obj)
  }
  localStorage.setItem(key, finalValue)
}

export const readObjectProp = (key, prop, def = null)  => {
  let obj = readObject(key)
  if (obj && Object.prototype.hasOwnProperty.call(obj, prop)) {
    return obj[prop]
  } else {
    return def;
  }
}
