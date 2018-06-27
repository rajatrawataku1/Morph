import React, { PropTypes } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { setJsonToCSvColoumnHead, setJsonToCsvFileObject, setCSVCreated, setJsonToCsvValues, setJsonInputText, setCsvOutputText } from '../../actions/index.js';

import '../../assets/styles/jsonToCsv.scss';
import '../../assets/styles/mate_icon.scss';

export class JSONtoCSV extends React.Component {

  constructor(props) {
    super(props)
  }

  convertTextAreatoCSV = ()=>{
    let textAreaString = this.props.jsonInputText;
    this.processDataJsonCsv(textAreaString,1);
  }

  handleFileSelectedJsonCsv = (event)=>{
    event.stopPropagation();
    event.preventDefault();

    let files = event.target.files;
    if(files.length>0){
      this.props.setJsonToCsvFileObject(files[0]);
      let loaderElement = this.refs.loaderDiv;
      loaderElement.setAttribute("style","display:block");
      let reader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = this.loadHandlerJsonCsv;
    }else{
      this.props.setJsonToCsvFileObject({name:""});
    }
    this.props.setCSVCreated(0);
  }

  loadHandlerJsonCsv = ()=>{
    let json = event.target.result;
    this.processDataJsonCsv(json);
  }

  processDataJsonCsv = (json,typeOfRequest=0)=>{

    let getCompleteCSV = (jsonObjectMain)=>{
      return new Promise( (resolve,reject)=>{
        let mainString ="";
        let jsonObjectMainLength = jsonObjectMain.length;
        jsonObjectMain.forEach( (singleObject,index) =>{

            //  coloumnHeads check is required
            let tempColoumnHead =Object.keys(singleObject);
            if( tempColoumnHead.length > this.props.columnNameJsonToCsv.length && index !=0){
              let coloumnHeads = Object.keys(singleObject);
              this.props.setJsonToCSvColoumnHead(coloumnHeads);
              let StringAfterFirstRow = mainString.substr(mainString.indexOf("\n"));
              let newFirstRowString = coloumnHeads.toString();
              mainString = newFirstRowString + StringAfterFirstRow;
            }

            if(index === 0){
              let coloumnHeads = Object.keys(singleObject);
              this.props.setJsonToCSvColoumnHead(coloumnHeads);
              let oneRow = coloumnHeads.toString();
              mainString = mainString + oneRow + "\n";
            }

              let arrayOfValues = Object.values(singleObject);
              let oneRow  = arrayOfValues.toString();
              mainString = mainString + oneRow + "\n";

            if(jsonObjectMainLength -1 === index){
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

          let loaderElement = this.refs.loaderDiv;
          loaderElement.setAttribute("style","display:none");

          if(typeOfRequest===1){
            this.props.setCsvOutputText(mainCSVString);
          }else{
            this.props.setJsonToCsvValues(mainCSVString);
            this.props.setCSVCreated(1);
          }

        })

      }catch(err){
        alert("Wrong JSON File");
      }
    }

  }

creatDownloadLink = (TotalData,fileName)=>{
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

  downloadCSV = ()=>{
    if( 'Blob' in window){
      let fileName = prompt('Please enter file name to save', 'untitled.csv');
      if(fileName){
        let dataToWrite= this.props.jsonToCsvValues;
        this.creatDownloadLink(dataToWrite,fileName);
      }
    }
  }

  removeAllText = ()=>{
    this.props.setJsonInputText("");
    this.props.setCsvOutputText("");
  }


  copyCSVClipboard = ()=>{

    let copyText = this.props.csvOutputText;
    let textArea = document.createElement("textarea");

    textArea.value = copyText;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      let successful = document.execCommand('copy');
      let msg = successful ? 'successful' : 'unsuccessful';
      Materialize.toast('CSV Copied to Clipboard', 2000) // 'rounded' is the class I'm applying to the toast
    } catch (err) {
    }
    document.body.removeChild(textArea);
  }


  render() {

    let divStyle = {
      height:"18rem",
      border:"none",
      outline:"none",
      backgroundColor:"#f0f0f0",
      borderRadius:"5px",
      padding:"10px",
      overflow:"scroll"
    };

    let buttonStyle = {
      paddingLeft :"10px",
      paddingRight : "1px"
    }

    let loaderStyle = {
      zIndex : "100"
    }

    return (

      <div className="mainApp" >
        <div style= {loaderStyle} className="loaderBox unshow" ref="loaderDiv">
          <div class="preloader-wrapper big active">
          <div class="spinner-layer spinner-blue">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div><div class="gap-patch">
              <div class="circle"></div>
            </div><div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div>

          <div class="spinner-layer spinner-red">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div><div class="gap-patch">
              <div class="circle"></div>
            </div><div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div>

          <div class="spinner-layer spinner-yellow">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div><div class="gap-patch">
              <div class="circle"></div>
            </div><div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div>

          <div class="spinner-layer spinner-green">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div><div class="gap-patch">
              <div class="circle"></div>
            </div><div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div>
        </div>
      </div>

        <div className="row">
          <div className="col s12">
            <br/>
          </div>
          <div className="col s12 m6 offset-m1 l6 offset-l1  markLine">
            <h3 className="textColor"> Convert JSON to CSV </h3>
          </div>
          <div className="col s12"><br/></div>
        </div>
        <div className="row">
          <div className="col s12 l4 offset-l1 m4 inputDiv">
            <div className="row">
              <div className="col s12"><br/></div>
              <div className="col s12">
                <div className="file-field input-field">
                  <div className="btn">
                    <span>File <i class="material-icons iconMiddle">cloud_upload</i> </span>
                    <input type="file" id="files" name="files[]" onChange={this.handleFileSelectedJsonCsv} />
                  </div>
                  <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" placeholder="Upload your  JSON file" defaultValue={this.props.fileObjectJsonToCsv.name}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={"col l3 offset-l1 m3 offset-m1 s12 " +(this.props.csvCreated===1?'show':'unshow')}>
            <br/><br/>
            <center>
            <a className="waves-effect waves-light btn" onClick={this.downloadCSV}><i className="material-icons right">cloud_download</i>Download CSV</a>
            </center>
          </div>

          <div className="col s12">
            <br/>
          </div>

          <div className="col s12 l4 offset-l1 m4 offset-m1 inputDiv">
              <br/>
              <label htmlFor"textarea3" className="normalText">Or paste your JSON here</label>
              <br/><br/>
              <textarea id="textarea3"  style={divStyle} rows="100" cols="50" value={this.props.jsonInputText} onChange={(event)=>{this.props.setJsonInputText(event.target.value)}}></textarea>
              <br/>
          </div>

          <div className="col s12 l2 ">
            <br/>
            <br/>
            <center>
              <a className="waves-effect waves-light btn" onClick={this.convertTextAreatoCSV}><i className="material-icons right">keyboard_arrow_right</i>Convert</a>
            </center>

            <br/>
            <br/>

            <center>
              <a className="waves-effect waves-light btn" onClick={this.removeAllText}><i className="material-icons right">clear</i>Clear</a>
            </center>

            <br/>
            <br/>
          </div>

          <div className="col s12 l4  m4  inputDiv">
            <br/>
            <div className="col s2">
              <label htmlFor"showTree" className="normalText"> CSV </label>
            </div>
            <div className={"col s4 " + (this.props.csvOutputText===""?'unshow':'show')}>
              <a class="waves-effect waves-light btn tooltipped" style={buttonStyle} data-position="bottom" data-delay="50" data-tooltip="Copy to Clipboard" onClick={this.copyCSVClipboard} ><i class="material-icons left">content_copy</i></a>
            </div>
            <div className="col s12">
              <br/>
            </div>
            <textarea id="textarea4"  style={divStyle} rows="100" cols="50" value={this.props.csvOutputText}></textarea>
            <br/>
          </div>

        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
    return {
      fileObjectJsonToCsv : state.fileObjectJsonToCsv,
      columnNameJsonToCsv : state.columnNameJsonToCsv ,
      csvCreated : state.csvCreated,
      jsonToCsvValues : state.jsonToCsvValues,
      jsonInputText:state.jsonInputText,
      csvOutputText:state.csvOutputText,
    }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setJsonToCsvFileObject : setJsonToCsvFileObject,
      setJsonToCSvColoumnHead : setJsonToCSvColoumnHead ,
      setCSVCreated : setCSVCreated,
      setJsonToCsvValues : setJsonToCsvValues,
      setJsonInputText : setJsonInputText,
      setCsvOutputText : setCsvOutputText,
    },dispatch)
};

export default connect(mapStateToProps,mapDispatchToProps)(JSONtoCSV);
