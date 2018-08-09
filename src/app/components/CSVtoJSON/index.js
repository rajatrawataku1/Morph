import React, { PropTypes } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { setCsvToJsonFileObject,  setfileJsonCreated,  setCsvToJsonValues, setcsvInputText,  setjsonOutputText, setTypeOfParsing, setTypeOfOutput, setLoaderStatus} from '../../actions/index.js';
import { converterCsvToJson } from "../../helpers"
import  csvtojson  from 'csvtojson';
import  fileReaderStream from 'filereader-stream';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import DownloadLink from "react-download-link";
import Loader from "../LoaderComponent/index.js";

import '../../assets/styles/csvToJson.scss';
import '../../assets/styles/mate_icon.scss';

const STYLES = {

  divStyle : {
    height:"18rem",
    border:"none",
    outline:"none",
    backgroundColor:"#f0f0f0",
    borderRadius:"5px",
    padding:"10px",
    overflow:"scroll"
  },

  buttonStyle : {
    paddingLeft :"10px",
    paddingRight : "1px"
  },

  downloadLinkStyle : {
    margin:"none",
    color:"white",
    textDecoration :"none",
    cursor :"pointer"
  },

  heyDoIt : {
    marginLeft :"10px"
  }

}


export class CSVtoJSON extends React.Component {

  constructor(props) {
    super(props)
  }

  hey(){
    console.log(this.onParsingChoice);
    console.log("Hey");
  }

  // change the parsing choice whehter null or space
  onParsingChoice = (event) => {
    let value = event.currentTarget.value;
    this.props.setTypeOfParsing(parseInt(value));
    this.props.setfileJsonCreated(0);
    this.props.setjsonOutputText("");
  }

  //  changing the type of output array or minified version
  onOutputChoice = (event) => {
    let value = event.currentTarget.value;
    this.props.setTypeOfOutput(parseInt(value));
    this.props.setfileJsonCreated(0);
    this.props.setjsonOutputText("");
  }

  //  this is the actual function which is convertin the file selected to json
  convertToJSON = () => {
    let fileObject = this.props.fileObject;
    //  comparing the file obejct if its empty returning from here only
    if(fileObject.name===""){
      alert("No file Chosen");
    }else{

      this.props.setLoaderStatus("show");
      let completeObject =[];
      let currentState = this.props.typeOfParsing;

      //  conerting the file object into file stream object
      let readStream = fileReaderStream(fileObject);
      //  if there is any error in the csv or we cant complete traverse the csv array then it is called

      converterCsvToJson(readStream,currentState,(completeObject) => {

        if(completeObject.length>0){

          let TotalData = this.createOutputType(completeObject);
          this.props.setCsvToJsonValues(TotalData);
          //  removing the loader now
          this.props.setLoaderStatus("unshow");
          //  setting the store variable that json is created
          this.props.setfileJsonCreated(1);

        }else{
          this.props.setLoaderStatus("unshow");
            alert("Wrong CSV FILE");
          // error
        }
      });
    }
  }

  //  whenever we change the file selected then it will change the state to the
  //  chosen file if no file selected then the state will have space

  checkFileType = (filename) => {
      if(filename.includes(".csv")){
        return 1;
      }else{
        return 0;
      }
  }

  handleFileSelectedCsvJson = (event) => {
    event.stopPropagation();
    event.preventDefault();
    let files = event.target.files;
    if(files.length > 0){
      if(this.checkFileType(files[0].name)){
        this.props.setCsvToJsonFileObject(files[0]);
        this.props.setfileJsonCreated(0);
      }else{
        alert("Wrong file Selected");
      }

    }else{
      console.log("Do nothing");
    }

  }

  // used for creating the json tree which is shown in the div with ID showTree
  createTheJsonText = (completeObject) => {

    let value = this.props.typeOfOutput;
    if(value){
      //  the output will be an array
      let TotalData=JSON.stringify(completeObject,null,4);
      this.props.setjsonOutputText(TotalData);
    }else{
      //  the output will be a minified version just directly use the native function
      let TotalData=JSON.stringify(completeObject);
      this.props.setjsonOutputText(TotalData);
    }

  }

  //  this creates the downlodable link its given the two Paramter
  //  TotalData which is the full string and fileName whih will be downloaded

    // function creates the TotalData according to the user option minified or an array of object
  createOutputType = (dataToWrite,fileName) => {
      let value = this.props.typeOfOutput;
      if(value){
        //  the output will be an array
        let TotalData=JSON.stringify(dataToWrite,null,4);
        return TotalData;
      }else{
        //  the output will be a minified version just directly use the native function
        let TotalData=JSON.stringify(dataToWrite);
        return TotalData;
      }
  }

  //  this convert the textarea csv to json by traversing each line one by one
  convertTextAreatoJSON = () => {
      let textAreaString = this.props.csvInputText;
      if(textAreaString === ""){
        alert("Textarea is empty");
        return;
      }

      csvtojson({
        noheader:true,
        output: "csv"
      })
      .fromString(textAreaString)
      .then((csvRow)=>{
        let ColoumnHead = csvRow[0];
        let currentState = this.props.typeOfParsing;
        csvRow.shift();

       let getSingleObject = (sampleArray) => {
         return new Promise((resolve,reject) => {
           let singleObject={};
           let arrayLength = sampleArray.length;
           sampleArray.forEach( (actualValue,index) => {

               let value  = actualValue.trim();
               if(value.length === 0 && currentState){
                 singleObject[ColoumnHead[index]]='';
               }else if(value.length !=0){

                 if(!isNaN(value)){
                   return singleObject[ColoumnHead[index]]=Number(value);
                 }
                 singleObject[ColoumnHead[index]]=value;
               }


             if(arrayLength -1 === index){
               resolve(singleObject);
             }
           })
         })
       }



       let getCompleteObject = (csvRow) => {
         return new Promise ((resolve,reject) => {
              let completeObject=[];
              let arrayLength = csvRow.length;
              csvRow.forEach( (singleArray,index) => {
                  getSingleObject(singleArray).then( (singleObject)=>{
                    completeObject.push(singleObject);
                  })
                  if(arrayLength -1 === index){
                    resolve(completeObject);
                  }
              });
         })
       }

       getCompleteObject(csvRow).then((result) => {
         this.props.setjsonOutputText(result);
         this.createTheJsonText(result);
       })

      })
  }

  // clearing both the divs by using this function
  removeAllText = ()=> {
    this.props.setcsvInputText("");
    this.props.setjsonOutputText("");
  }


  render() {

    const {fileObject,  fileJsonCreated , jsonOutputText, csvToJsonvalues, csvInputText, setcsvInputText, typeOfParsing, typeOfOutput} = this.props;
    let fileName = fileObject.name;
    let fileJsonCreatedClass = (fileJsonCreated===0?'show':'unshow');
    let DownloadClass = (fileJsonCreated===1?'show':'unshow');
    let jsonOuputTextClass = (jsonOutputText===""?'unshow':'show');
    let fileObjectOutputName  = fileObject.name.split(".csv")[0]+".json"


      return(
        <div className="mainApp" >

          <Loader/>

          <div className="row">
            <div className="col s12">
              <br/>
            </div>
            <div className="col s12 m6 offset-m1 l6 offset-l1  markLine">
              <h3 className="textColor"> Convert CSV to JSON </h3>
            </div>
            <div className="col s12"><br/></div>
          </div>
          <div className="row">

            <div className="col l4 offset-l1  s12 inputDiv">

              <div className="col l6 s12">
                <label className="smallText">Options for Conversion</label>
                <form action="#">
                  <p>
                    <input class="with-gap"
                       type="radio"
                       name="group1"
                       value="1"
                       checked={typeOfParsing === 1}
                       onChange={this.onParsingChoice}
                       id="test1"
                     />
                    <label htmlFor="test1">Empty Values Required</label>
                  </p>
                  <p>
                    <input class="with-gap"
                      name="group1"
                      type="radio"
                      value="0"
                      checked={typeOfParsing === 0}
                      onChange={this.onParsingChoice}
                       id="test2" />
                    <label htmlFor="test2">Remove empty values </label>
                  </p>
                </form>
                <br/>
              </div>

              <div className="col l6 s12">
                <label className="smallText">Option for Output</label>
                <form action="#">
                  <p>
                    <input class="with-gap"
                       type="radio"
                       name="group2"
                       value="1"
                       checked={typeOfOutput === 1}
                       onChange={this.onOutputChoice}
                       id="test3"
                     />
                    <label htmlFor="test3">Array</label>
                  </p>
                  <p>
                    <input class="with-gap"
                      name="group2"
                      type="radio"
                      value="0"
                      checked={typeOfOutput === 0}
                      onChange={this.onOutputChoice}
                       id="test4" />
                    <label htmlFor="test4">Minified Array</label>
                  </p>
                </form>
                <br/>
              </div>

            </div>

            <div className="col s12 l4 offset-l2   inputDiv">
              <div className="row">
                <div className="col s12"><br/></div>
                <div className="col l7  m5 s12 fileBox">
                  <form action="#" id="formInputFile">
                    <div className="file-field input-field">
                      <div className="btn">
                        <span>File <i class="material-icons iconMiddle">cloud_upload</i> </span>
                        <input type="file" id="files" name="files[]" onChange={this.handleFileSelectedCsvJson} value={this.file} />
                      </div>
                      <div className="file-path-wrapper">
                        <input className="file-path" type="text" placeholder="Upload csv" value={fileName} />
                      </div>
                    </div>
                  </form>
                </div>

                <div className={"col l5 s12  m5 " + fileJsonCreatedClass}>
                  <br/>
                  <center>
                  <a className="waves-effect waves-light btn" onClick={this.convertToJSON}>Convert</a>
                  </center>
                </div>
                <div className={"col l5 s12 m5 " +DownloadClass}>
                  <br/>
                  <center>
                    <DownloadLink  style={STYLES.downloadLinkStyle} label="Download JSON" className="waves-effect waves-light btn" filename={fileObjectOutputName}  exportFile={() => csvToJsonvalues}>
                    </DownloadLink>
                  </center>
                </div>

              </div>
            </div>


            <div className="col s12">
              <br/>
            </div>
            <div className="col s12 l4 offset-l1 m4 offset-m1 inputDiv">
                <br/>
                <label htmlFor="textarea1" className="normalText">Or paste your CSV here</label>
                <br/><br/>
                <textarea id="textarea1"  style={STYLES.divStyle} rows="100" cols="50"  value={csvInputText} onChange={(event)=>{setcsvInputText(event.target.value)}} ></textarea>
                <br/>
            </div>

            <div className="col s12 l2 ">
              <center>
              <br/> <br/> <br/> <br/>
              <br/>
                <a className="waves-effect waves-light btn" onClick={this.convertTextAreatoJSON}><i className="material-icons right">keyboard_arrow_right</i>Convert</a>
              <br/>
              <br/>
                <a className="waves-effect waves-light btn" onClick={this.removeAllText}><i className="material-icons right">clear</i>Clear &nbsp; &nbsp; &nbsp; </a>
              <br/>
              <br/>
              </center>
            </div>

            <div className="col s12 l4  m4  inputDiv">
              <br/>
              <div className="col s2">
                <label htmlFor="showTree" className="normalText"> JSON </label>
              </div>
              <div className={"col s4 " + jsonOuputTextClass}>
                <CopyToClipboard text={jsonOutputText}>
                  <button class="waves-effect waves-light btn " style={STYLES.buttonStyle}><i class="material-icons left">content_copy</i></button>
                </CopyToClipboard>
              </div>
              <div className="col s12">
                <br/>
              </div>
              <textarea style={STYLES.divStyle}  id="textarea2"  rows="100" cols="50" value={jsonOutputText} ></textarea>
              <br/>
            </div>
          </div>
        </div>
      )
    }
}

const mapStateToProps = (state)=> {
  const {
    csvToJsonvalues,
    fileJsonCreated,
    fileObject,
    csvInputText,
    jsonOutputText,
    typeOfParsing,
    typeOfOutput
  } = state

  return {
    csvToJsonvalues,
    fileJsonCreated,
    fileObject,
    csvInputText,
    jsonOutputText,
    typeOfParsing,
    typeOfOutput
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setfileJsonCreated,
    setCsvToJsonValues,
    setcsvInputText,
    setjsonOutputText,
    setCsvToJsonFileObject,
    setTypeOfParsing,
    setTypeOfOutput,
    setLoaderStatus
  }, dispatch)
};

export default connect(mapStateToProps,mapDispatchToProps)(CSVtoJSON);
