
import  csvtojson  from 'csvtojson';

export function converterCsvToJson(readStream,currentState,callback){

  let completeObject =[];

  let onError = (e) => {
    callback ([]);
  }

  //  when the whole csv array is traversed then this is called
  let onComplete = () => {
    callback(completeObject);
  }

  csvtojson().fromStream(readStream)
    .subscribe((json) => {
      let keysArray = Object.keys(json);
      keysArray.forEach( (key)=>{
        let value = json[key];
        let actualValue = json[key].trim();
        if( actualValue.length === 0 && !currentState){
          delete json[key];
        }else if(actualValue.length != 0){
          if(!isNaN(actualValue)){
              return json[key]=Number(actualValue);
          }
        }
      })

      completeObject.push(json);
    },onError,onComplete);

}
