// import { combineReducers } from "redux"
import { SET_COLUMN_HEAD, SET_CSV_UPLOADED, SET_JSON_CREATED, SET_CSV_CREATED, SET_JSON_UPLOADED, SET_VALUES } from '../actions/index.js';

const initialState = {
  columnName : [] ,
  values : [] ,
  csvUploaded : 0,
  jsonCreated : 0,
  csvCreated : 0,
  jsonUploaded : 0
}

let AppFunction = (state=initialState,action) =>{
  switch (action.type) {
    case SET_COLUMN_HEAD:
        console.log("coloumn set");
        return Object.assign({},state,{
          columnName :action.data
        })

    case SET_CSV_UPLOADED:
        return Object.assign({},state,{
          csvUploaded : action.data
        })

    case SET_JSON_CREATED:
        return Object.assign({},state,{
          jsonCreated : action.data
        })

    case SET_VALUES:
        return Object.assign({},state,{
          values : action.data
        });

    case SET_JSON_UPLOADED:
        return Object.assign({},state,{
          jsonUploaded:action.data
        })

    case SET_CSV_CREATED:
        return Object.assign({},state,{
          csvCreated:action.data
        })
        
    default:
        return state;
  }
}

const ReducerApp = AppFunction;
export default ReducerApp;

// export default combineReducers({
//
// })
