import React, {PropTypes} from "react"
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { setColoumnHead, setCSVUploaded, setJSONCreated,setValues } from '../../actions/index.js';

// @connect((store) => {
//   return {
//
//   };
// })

export class CSVtoJSON extends React.Component {

  constructor(props) {
    super(props)
    this.handleFileSelectedCsvJson = this.handleFileSelectedCsvJson.bind(this);
    this.processDataCsvJson = this.processDataCsvJson.bind(this);
    this.loadHandlerCsvJson = this.loadHandlerCsvJson.bind(this);
    this.downloadJSON = this.downloadJSON.bind(this);
    this.creatDownloadLink = this.creatDownloadLink.bind(this);
  }

  handleFileSelectedCsvJson(event){
    event.stopPropagation();
    event.preventDefault();
    this.props.setCSVUploaded(0);
    this.props.setJSONCreated(0);
    // this.setState( {csvUploaded: 0});
    // this.setState( {jsonCreated : 0});

    let files = event.target.files;
    if(files.length>0){
      // console.log(files);
      // console.log(files[0].name);
      // read the file
      let reader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = this.loadHandlerCsvJson;
    }else{
      // console.log("No file Selected");
    }

  }

  loadHandlerCsvJson(){
    this.props.setCSVUploaded(1);
    // this.setState( {csvUploaded: 1});
    let csv = event.target.result;
    this.processDataCsvJson(csv);
  }

  processDataCsvJson(csv){
    // String.split("[\\r\\n]+")

    if(csv ===""){
      alert("File is Empty");
      return;
    }else{
      // console.log(csv);
      let allCsvRows = csv.split(/\r\n|\n/);

      // console.log("Number of Rows  : "+allCsvRows.length);

        let  getSingleObject = (allText)=>{
              return new Promise( (resolve,reject)=>{
                let SingleJSONObject = {};
                let arrayLength = allText.length;
                let iteratorCheck = this.props.columnName.length;
                let temp_state= this.props.columnName;
                // console.log("Iterator check value : "+iteratorCheck);
                // console.log("Array length check value : "+arrayLength);

                allText.some( (text,index) =>{
                  // console.log("Index inside : "+index);
                  if(text===""){
                    SingleJSONObject[temp_state[index]] = null;
                  }else{
                    if(isNaN(text)){
                      SingleJSONObject[temp_state[index]] = text;
                    }else{
                      SingleJSONObject[temp_state[index]] = Number(text);
                    }
                  }
                  if( index === iteratorCheck -1 ){
                    console.log("resolved");
                    resolve(SingleJSONObject);
                    return true;
                  }
                })

                // allText.forEach( (text,index) =>{
                //   console.log("Index inside : "+index);
                //   if(text===""){
                //     SingleJSONObject[temp_state[index]] = null;
                //   }else{
                //     if(isNaN(text)){
                //       SingleJSONObject[temp_state[index]] = text;
                //     }else{
                //       SingleJSONObject[temp_state[index]] = Number(text);
                //     }
                //   }
                //   if( index === iteratorCheck -1 ){
                //     console.log("resolved");
                //     resolve(SingleJSONObject);
                //     break;
                //   }
                // });
              })
        }

        let getCompleteObject = (allCsvRows)  =>{
            return new Promise ( (resolve,reject) =>{
              let CompleteJSONObject = [];
              let arrayLength = allCsvRows.length;
              // console.log(allCsvRows);
              allCsvRows.forEach(  (row,index) =>{
                  if(index === 0){
                    let coloumnHeads = row.split(/,/);
                    this.props.setColoumnHead(coloumnHeads);
                  }else{
                    let allText = row.split(/,/);
                    // console.log("All text : "+allText)
                    getSingleObject(allText).then( (SingleJSONObject) =>{
                      CompleteJSONObject.push(SingleJSONObject);
                    })
                  }
                  if(arrayLength -1 === index){
                    console.log("resolve outer too");
                    resolve(CompleteJSONObject);
                  }
              })
            });
        }

        getCompleteObject(allCsvRows).then( (CompleteJSONObject) =>{
          this.props.setValues(CompleteJSONObject);
          this.props.setJSONCreated(1);
          // this.setState ( { values : CompleteJSONObject });
          // this.setState ( { jsonCreated : 1});
        })


    }
}

creatDownloadLink(TotalData,fileName){
    let textFileAsBlob = new Blob([TotalData], { type: 'text/plain' });
    let downloadLink = document.createElement('a');
    downloadLink.download = fileName;
    downloadLink.innerHTML = 'Download File';
    if ('webkitURL' in window) {
      // Chrome allows the link to be clicked without actually adding it to the DOM.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    } else {
      // Firefox requires the link to be added to the DOM before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
    }
    downloadLink.click();
  }

  downloadJSON(){

    if( 'Blob' in window){
      let fileName = prompt('Please enter file name to save', 'Untitled.json');
      if(fileName){
        let dataToWrite= this.props.values;
        if(dataToWrite.length === 0){
          let TotalData="[]";
          this.creatDownloadLink(TotalData,fileName);
        }else{
          let TotalData="[";
          let dataToWriteLength = dataToWrite.length;
          dataToWrite.forEach( (data,index)=>{
            if(index === dataToWriteLength -1){
              TotalData=TotalData+ JSON.stringify(data) + "]";
              this.creatDownloadLink(TotalData,fileName);
            }else{
              TotalData=TotalData+ JSON.stringify(data) +",\n";
            }
          })
        }
      }
    }

  }

  componentWillMount() {

  }

  render() {
    if(this.props.jsonCreated === 1){
      return(
        <div>
          <h2> Convert CSV to JSON </h2>
          <input type="file" id="files" name="files[]" onChange={this.handleFileSelectedCsvJson} multiple />
          <button onClick={this.downloadJSON}> Download JSON </button>
        </div>
      )
    }else{
      return(
        <div>
          <h2> Convert CSV to JSON </h2>
          <input type="file" id="files" name="files[]" onChange={this.handleFileSelectedCsvJson} multiple />
        </div>
      )
    }

  }
}

function mapStateToProps(state){
    return {
      columnName : state.columnName ,
      values : state.values,
      csvUploaded : state.csvUploaded,
      jsonCreated : state.jsonCreated
    }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setColoumnHead : setColoumnHead ,
      setCSVUploaded : setCSVUploaded,
      setJSONCreated : setJSONCreated,
      setValues : setValues

    },dispatch)
};

export default connect(mapStateToProps,mapDispatchToProps)(CSVtoJSON);
