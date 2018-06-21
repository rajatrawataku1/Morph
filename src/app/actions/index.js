export const SET_COLUMN_HEAD = 'SET_COLUMN_HEAD';
export const SET_CSV_UPLOADED = 'SET_CSV_UPLOADED';
export const SET_JSON_CREATED = 'SET_JSON_CREATED';
export const SET_VALUES = 'SET_VALUES';
export const SET_CSV_CREATED = 'SET_CSV_CREATED';
export const SET_JSON_UPLOADED = 'SET_JSON_UPLOADED';

export function setColoumnHead (tempData){
  return {
    type:SET_COLUMN_HEAD,
    data:tempData
  }
}

export function setCSVUploaded(tempData){
  return {
    type:SET_CSV_UPLOADED,
    data:tempData
  }
}

export function setJSONCreated(tempData){
  return {
      type:SET_JSON_CREATED,
      data:tempData
  }
}

export function setCSVCreated(tempData){
  return {
    type:SET_CSV_CREATED,
    data:tempData
  }
}

export function setJSONUploaded(tempData){
  return {
    type:SET_JSON_UPLOADED,
    data:tempData
  }
}

export function setValues(tempData){
  return {
      type:SET_VALUES,
      data:tempData
  }
}
