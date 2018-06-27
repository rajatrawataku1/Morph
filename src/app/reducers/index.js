import { SET_CSV_TO_JSON_FILE_OBJECT,   SET_FILE_JSON_CREATED, SET_CSV_TO_JSON_VALUES,SET_CSV_INPUT_TEXT, SET_JSON_OUTPUT_TEXT } from '../actions/index.js';

import { SET_JSON_TO_CSV_FILE_OBJECT, SET_JSON_TO_CSV_COLUMN_HEAD, SET_CSV_CREATED , SET_JSON_TO_CSV_VALUES, SET_JSON_INPUT_TEXT, SET_CSV_OUTPUT_TEXT } from '../actions/index.js';

const initialState = {
  columnNameJsonToCsv : [],
  csvToJsonvalues : [],
  jsonToCsvValues : "",
  fileObject:{"name":""} ,
  fileObjectJsonToCsv : { "name":""},
  csvInputText:"",
  jsonOutputText:"",
  jsonInputText:"",
  csvOutputText:"",
  fileJsonCreated : 0,
  csvCreated : 0,
}

const AppFunction = (state=initialState,action) => {
  switch (action.type) {

    case SET_CSV_TO_JSON_FILE_OBJECT:
        return Object.assign({},state,{
          fileObject:action.data
        })


    case SET_FILE_JSON_CREATED:
        return Object.assign({},state,{
          fileJsonCreated : action.data
        })

    case SET_CSV_TO_JSON_VALUES:
        return Object.assign({},state,{
          csvToJsonvalues : action.data
        });

    case SET_CSV_INPUT_TEXT:
        return Object.assign({},state,{
          csvInputText:action.data
        })

    case SET_JSON_OUTPUT_TEXT:
        return Object.assign({},state,{
          jsonOutputText:action.data
        })

    // #######################################################

    case SET_JSON_TO_CSV_FILE_OBJECT:
        return Object.assign({},state,{
          fileObjectJsonToCsv:action.data
        })

    case SET_JSON_TO_CSV_COLUMN_HEAD:
        return Object.assign({},state,{
          columnNameJsonToCsv:action.data
        })

    case SET_CSV_CREATED:
        return Object.assign({},state,{
          csvCreated:action.data
        })

    case SET_JSON_TO_CSV_VALUES:
        return Object.assign({},state,{
          jsonToCsvValues:action.data
        })

    case SET_JSON_INPUT_TEXT:
        return Object.assign({},state,{
          jsonInputText:action.data
        })


    case SET_CSV_OUTPUT_TEXT:
        return Object.assign({},state,{
          csvOutputText:action.data
        })


    default:
        return state;
  }
}

const ReducerApp = AppFunction;
export default ReducerApp;
