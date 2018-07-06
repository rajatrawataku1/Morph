export const SET_CSV_TO_JSON_FILE_OBJECT = 'SET_CSV_TO_JSON_FILE_OBJECT';
export const SET_FILE_JSON_CREATED = 'SET_FILE_JSON_CREATED';
export const SET_CSV_TO_JSON_VALUES = 'SET_CSV_TO_JSON_VALUES';
export const SET_CSV_INPUT_TEXT = 'SET_CSV_INPUT_TEXT';
export const SET_JSON_OUTPUT_TEXT = 'SET_JSON_OUTPUT_TEXT';
export const SET_TYPE_OF_PARSING = 'SET_TYPE_OF_PARSING';
export const SET_TYPE_OF_OUTPUT = 'SET_TYPE_OF_OUTPUT';

// ############################################################

export const SET_JSON_TO_CSV_FILE_OBJECT = 'SET_JSON_TO_CSV_FILE_OBJECT';
export const SET_JSON_TO_CSV_COLUMN_HEAD = 'SET_JSON_TO_CSV_COLUMN_HEAD';
export const SET_CSV_CREATED = 'SET_CSV_CREATED';
export const SET_JSON_TO_CSV_VALUES  = 'SET_JSON_TO_CSV_VALUES';
export const SET_JSON_INPUT_TEXT = 'SET_JSON_INPUT_TEXT';
export const SET_CSV_OUTPUT_TEXT = 'SET_CSV_OUTPUT_TEXT';


// ###############################################################
export const SET_LOADER_STATUS ='SET_LOADER_STATUS';


export function setCsvToJsonFileObject(tempData){
  return {
      type:SET_CSV_TO_JSON_FILE_OBJECT,
      data:tempData
  }
}

export function setfileJsonCreated(tempData){
  return {
      type:SET_FILE_JSON_CREATED,
      data:tempData
  }
}

export function setCsvToJsonValues(tempData){
  return {
      type:SET_CSV_TO_JSON_VALUES,
      data:tempData
  }
}

export function setcsvInputText(tempData){
  return {
      type:SET_CSV_INPUT_TEXT,
      data:tempData
  }
}

export function setjsonOutputText(tempData){
  return {
      type:SET_JSON_OUTPUT_TEXT,
      data:tempData
  }
}

export function setTypeOfParsing(tempData){
  return {
      type:SET_TYPE_OF_PARSING,
      data:tempData
  }
}

export function setTypeOfOutput(tempData){
  return {
      type:SET_TYPE_OF_OUTPUT,
      data:tempData
  }
}


// ##############################################################

export function setJsonToCsvFileObject(tempData){
  return {
    type:SET_JSON_TO_CSV_FILE_OBJECT,
    data:tempData
  }
}

export function setJsonToCSvColoumnHead(tempData){
  return {
    type:SET_JSON_TO_CSV_COLUMN_HEAD,
    data:tempData
  }
}


export function setCSVCreated(tempData){
  return {
    type:SET_CSV_CREATED,
    data:tempData
  }
}

export function setJsonToCsvValues(tempData){
  return {
    type:SET_JSON_TO_CSV_VALUES,
    data:tempData
  }
}

export function setJsonInputText(tempData){
  return {
    type:SET_JSON_INPUT_TEXT,
    data:tempData
  }
}

export function setCsvOutputText(tempData){
  return {
    type:SET_CSV_OUTPUT_TEXT,
    data:tempData
  }
}

export function setJSONUploaded(tempData){
  return {
    type:SET_JSON_UPLOADED,
    data:tempData
  }
}

// ###########################

export function setLoaderStatus(tempData){
  return {
    type:SET_LOADER_STATUS,
    data:tempData
  }
}
