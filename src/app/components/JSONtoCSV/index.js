import React, {PropTypes} from "react"
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { setColoumnHead, setJSONUploaded, setCSVCreated ,setValues } from '../../actions/index.js';

// @connect((store) => {
//   return {
//
//   };
// })

export class JSONtoCSV extends React.Component {

  constructor(props) {
    super(props)
    this.handleFileSelectedJsonCsv = this.handleFileSelectedJsonCsv.bind(this);
    this.processDataJsonCsv = this.processDataJsonCsv.bind(this);
    this.loadHandlerJsonCsv = this.loadHandlerJsonCsv.bind(this);
    this.downloadCSV = this.downloadCSV.bind(this);
    this.creatDownloadLink = this.creatDownloadLink.bind(this);
  }

  handleFileSelectedJsonCsv(event){

    event.stopPropagation();
    event.preventDefault();
    this.props.setJSONUploaded(0);
    this.props.setCSVCreated(0);
    // this.setState( {csvUploaded: 0});
    // this.setState( {jsonCreated : 0});

    let files = event.target.files;
    if(files.length>0){
      // console.log(files);
      // console.log(files[0].name);
      // read the file
      let reader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = this.loadHandlerJsonCsv;
    }else{
      console.log("No file Selected");
    }
  }

  loadHandlerJsonCsv(){
    this.props.setJSONUploaded(1);
    // this.setState( {csvUploaded: 1});
    let json = event.target.result;
    this.processDataJsonCsv(json);
  }

  processDataJsonCsv(json){

    let getCompleteCSV = (jsonObjectMain)=>{
      return new Promise( (resolve,reject)=>{
        let mainString ="";
        let jsonObjectMainLength = jsonObjectMain.length;
        jsonObjectMain.forEach( (singleObject,index) =>{
            if(index === 0){
              let coloumnHeads = Object.keys(singleObject);
              this.props.setColoumnHead(coloumnHeads);
              let oneRow = coloumnHeads.toString();
              mainString = mainString + oneRow + "\n";
            }

            let arrayOfValues = Object.values(singleObject);
            let oneRow  = arrayOfValues.toString();
            mainString = mainString + oneRow + "\n";

            if(jsonObjectMainLength -1 === index){
              console.log("Resolved JSON to CSV");
              resolve(mainString);
            }
        });

      })
    }

    if(json ===""){
      alert("File is Empty");
      return;
    }else{
      // conversion logic
      try{
        let jsonObjectMain = JSON.parse(json);
        getCompleteCSV(jsonObjectMain).then( (mainCSVString) =>{
          this.props.setValues(mainCSVString);
          this.props.setCSVCreated(1);
        })

      }catch(err){
        console.log(err);
        alert("Wrong JSON File");
        console.log("Wrong JSON Object");
      }
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

  downloadCSV(){
    if( 'Blob' in window){
      let fileName = prompt('Please enter file name to save', 'untitled.csv');
      if(fileName){
        let dataToWrite= this.props.values;
        this.creatDownloadLink(dataToWrite,fileName);
      }
    }
  }

  componentWillMount() {

  }

  render() {
    if(this.props.csvCreated === 1){
      return(
        <div>
          <h2> Convert JSON to CSV </h2>
          <input type="file" id="files" name="files[]" onChange={this.handleFileSelectedJsonCsv} multiple />
          <button onClick={this.downloadCSV}> Download JSON </button>
        </div>
      )
    }else{
      return(
        <div>
          <h2> Convert JSON to CSV </h2>
          <input type="file" id="files" name="files[]" onChange={this.handleFileSelectedJsonCsv} multiple />
        </div>
      )
    }

  }
}

function mapStateToProps(state){
    return {
      columnName : state.columnName ,
      values : state.values,
      csvCreated : state.csvCreated,
      jsonUploaded : state.jsonUploaded
    }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setColoumnHead : setColoumnHead ,
      setCSVCreated : setCSVCreated,
      setJSONUploaded : setJSONUploaded,
      setValues : setValues
    },dispatch)
};

export default connect(mapStateToProps,mapDispatchToProps)(JSONtoCSV);
