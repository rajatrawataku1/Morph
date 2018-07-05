import React, { PropTypes } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { setJsonToCSvColoumnHead, setJsonToCsvFileObject, setCSVCreated, setJsonToCsvValues, setJsonInputText, setCsvOutputText, setLoaderStatus } from '../../actions/index.js';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import DownloadLink from "react-download-link";
import '../../assets/styles/jsonToCsv.scss';
import '../../assets/styles/mate_icon.scss';
import Loader from "../LoaderComponent/index.js";

export class JSONtoCSV extends React.Component {

  constructor(props) {
    super(props)
  }

  convertTextAreatoCSV = ()=>{
    let textAreaString = this.props.jsonInputText;
    if(textAreaString === ""){
      alert("Textarea is empty")
    }else{
      this.processDataJsonCsv(textAreaString,1);
    }
  }

  checkFileType = (filename)=>{
      if(filename.includes(".json")){
        return 1;
      }else{
        return 0;
      }
  }

  handleFileSelectedJsonCsv = (event)=>{
    event.stopPropagation();
    event.preventDefault();

    let files = event.target.files;

    if(files.length>0){
      if(this.checkFileType(files[0].name)){
        this.props.setJsonToCsvFileObject(files[0]);
        this.props.setLoaderStatus("show")
        let reader = new FileReader();
        reader.readAsText(files[0]);
        reader.onload = this.loadHandlerJsonCsv;
        this.props.setCSVCreated(0);
      }else{
        alert("Wrong file Selected");
      }
    }else{
      console.log("Do nothing");
    }

  }

  loadHandlerJsonCsv = ()=>{
    let json = event.target.result;
    this.processDataJsonCsv(json);
  }

  processDataJsonCsv = (json,typeOfRequest=0)=>{

    let getCompleteCSV = (jsonObjectMain)=>{

      return new Promise( (resolve,reject)=>{
        let tempColoumnHead = [];
        let content = [];
        let jsonObjectMainLength = jsonObjectMain.length;
        jsonObjectMain.forEach((singleObject,index) =>{
          let keys = Object.keys(singleObject);
          keys.forEach((key)=> {
            if (tempColoumnHead.indexOf(key) === -1) {
              tempColoumnHead.push(key);
            }
          });
          if(index == jsonObjectMainLength-1){
            this.props.setJsonToCSvColoumnHead(tempColoumnHead);
          }
        });

        jsonObjectMain.forEach( (singleObject,index) =>{
            let values=[];
            tempColoumnHead.forEach((key)=>{

              let value = singleObject[key];
              let valueType = typeof value;
              if(value === undefined){
                values.push('');
              } else if( (valueType === 'number') || (valueType === 'boolean') ){
                values.push(value);
              } else if ((valueType === 'string')) {
                values.push(JSON.stringify(value));
              }else if(valueType === 'object' && value instanceof Array){
                value = value.join();
                values.push(JSON.stringify(value));
              }else{
                values.push('');
              }
            })
            content.push(values);
        });

        tempColoumnHead = tempColoumnHead.join(',');
        content = content.join('\r\n');
        let mainCSVString = [tempColoumnHead,content].join('\r\n');
        resolve(mainCSVString);

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

          this.props.setLoaderStatus("unshow")

          if(typeOfRequest===1){
            this.props.setCsvOutputText(mainCSVString);
          }else{
            this.props.setJsonToCsvValues(mainCSVString);
            this.props.setCSVCreated(1);
          }

        })

      }catch(err){
        this.props.setLoaderStatus("unshow")
        alert("Wrong JSON File");
      }
    }

  }

  removeAllText = ()=>{
    this.props.setJsonInputText("");
    this.props.setCsvOutputText("");
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


    let downloadLinkStyle={
      margin:"none",
      color:"white",
      textDecoration :"none",
      cursor :"pointer"
    }

    return (

      <div className="mainApp" >
        <Loader/>

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
                    <input className="file-path validate" type="text" placeholder="Upload your  JSON file" value={this.props.fileObjectJsonToCsv.name}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={"col l3 offset-l1 m3 offset-m1 s12 " +(this.props.csvCreated===1?'show':'unshow')}>
            <br/><br/>
            <center>
              <DownloadLink  style={downloadLinkStyle} label="Download CSV" className="waves-effect waves-light btn" filename={this.props.fileObjectJsonToCsv.name.split(".json")[0]+".csv"}  exportFile={() => this.props.jsonToCsvValues}>
              </DownloadLink>
            </center>
          </div>

          <div className="col s12">
            <br/>
          </div>

          <div className="col s12 l4 offset-l1 m4 offset-m1 inputDiv">
              <br/>
              <label htmlFor="textarea3" className="normalText">Or paste your JSON here</label>
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
              <label htmlFor="showTree" className="normalText"> CSV </label>
            </div>
            <div className={"col s4 " + (this.props.csvOutputText===""?'unshow':'show')}>
              <CopyToClipboard text={this.props.csvOutputText}>
                <a class="waves-effect waves-light btn" style={buttonStyle}><i class="material-icons left">content_copy</i></a>
              </CopyToClipboard>
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

  const {
    fileObjectJsonToCsv,
    columnNameJsonToCsv ,
    csvCreated ,
    jsonToCsvValues ,
    jsonInputText,
    csvOutputText,
  }=state;

  return {
    fileObjectJsonToCsv,
    columnNameJsonToCsv ,
    csvCreated ,
    jsonToCsvValues ,
    jsonInputText,
    csvOutputText,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setJsonToCsvFileObject ,
      setJsonToCSvColoumnHead ,
      setCSVCreated ,
      setJsonToCsvValues ,
      setJsonInputText ,
      setCsvOutputText ,
      setLoaderStatus
    },dispatch)
};

export default connect(mapStateToProps,mapDispatchToProps)(JSONtoCSV);
