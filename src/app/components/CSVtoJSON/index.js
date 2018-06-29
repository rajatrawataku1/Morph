import React, { PropTypes } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { setCsvToJsonFileObject,  setfileJsonCreated,  setCsvToJsonValues, setcsvInputText,  setjsonOutputText, setTypeOfParsing, setTypeOfOutput, setLoaderStatus, converterCsvToJson} from '../../actions/index.js';
import  csvtojson  from 'csvtojson';
import  fileReaderStream from 'filereader-stream';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import DownloadLink from "react-download-link";
import Loader from "../LoaderComponent/index.js";

import '../../assets/styles/csvToJson.scss';
import '../../assets/styles/mate_icon.scss';

export class CSVtoJSON extends React.Component {

  constructor(props) {
    super(props)
  }

  // change the parsing choice whehter null or space
  onParsingChoice = (event)=>{
    let value = event.currentTarget.value;
    this.props.setTypeOfParsing(parseInt(value));
    this.props.setfileJsonCreated(0);
    this.props.setjsonOutputText("");
  }

  //  changing the type of output array or minified version
  onOutputChoice = (event)=>{
    let value = event.currentTarget.value;
    this.props.setTypeOfOutput(parseInt(value));
    this.props.setfileJsonCreated(0);
    this.props.setjsonOutputText("");
  }

  //  this is the actual function which is convertin the file selected to json
  convertToJSON = ()=>{
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

      converterCsvToJson(readStream,currentState,(completeObject)=>{
        console.log(completeObject);

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
      // console.log(result);

      // let onError = (e)=>{
      //   this.props.setLoaderStatus("unshow");
      //     alert("Wrong CSV FILE");
      // }
      //
      // //  when the whole csv array is traversed then this is called
      // let onComplete = ()=>{
      //
      //   let TotalData = this.createOutputType(completeObject);
      //   this.props.setCsvToJsonValues(TotalData);
      //   //  removing the loader now
      //   this.props.setLoaderStatus("unshow");
      //   //  setting the store variable that json is created
      //   this.props.setfileJsonCreated(1);
      // }

      //  libraty function which reads every line from csv and give correspodig json
      // csvtojson().fromStream(readStream)
      //   .subscribe((json)=>{
      //     //  comparing the current state if its 1 then change the empty values to null
      //     //  if its value then in the output file the space will be shown for the values
      //
      //     if(currentState){
      //       let keysArray = Object.keys(json);
      //       keysArray.forEach( (key)=>{
      //         if (json[key]===""){
      //           json[key]=null;
      //         }
      //       })
      //       completeObject.push(json);
      //     }else{
      //       completeObject.push(json);
      //     }
      //
      //   },onError,onComplete);
    }
  }

  //  whenever we change the file selected then it will change the state to the
  //  chosen file if no file selected then the state will have space

  checkFileType = (filename)=>{
      if(filename.includes(".csv")){
        return 1;
      }else{
        return 0;
      }
  }

  handleFileSelectedCsvJson = (event)=>{
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
  createTheJsonText = (completeObject)=>{

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
  createOutputType = (dataToWrite,fileName)=>{
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
  convertTextAreatoJSON = () =>{
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

       let getSingleObject = (sampleArray)=>{
         return new Promise((resolve,reject)=>{
           let singleObject={};
           let arrayLength = sampleArray.length;
           sampleArray.forEach( (value,index)=>{

             if(value===""){
                if(currentState){
                  singleObject[ColoumnHead[index]]=null;
                }else{
                  singleObject[ColoumnHead[index]]="";
                }
             }else{
               singleObject[ColoumnHead[index]]=value;
             }

             if(arrayLength -1 === index){
               resolve(singleObject);
             }
           })
         })
       }

       let getCompleteObject = (csvRow)=>{
         return new Promise ((resolve,reject)=>{
              let completeObject=[];
              let arrayLength = csvRow.length;
              csvRow.forEach( (singleArray,index)=>{
                  getSingleObject(singleArray).then( (singleObject)=>{
                    completeObject.push(singleObject);
                  })
                  if(arrayLength -1 === index){
                    resolve(completeObject);
                  }
              });
         })
       }

       getCompleteObject(csvRow).then((result)=>{
         this.props.setjsonOutputText(result);
         this.createTheJsonText(result);
       })

      })
  }

  // clearing both the divs by using this function
  removeAllText = ()=>{
    this.props.setcsvInputText("");
    this.props.setjsonOutputText("");
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
                       checked={this.props.typeOfParsing === 1}
                       onChange={this.onParsingChoice}
                       id="test1"
                     />
                    <label htmlFor="test1">Object value null</label>
                  </p>
                  <p>
                    <input class="with-gap"
                      name="group1"
                      type="radio"
                      value="0"
                      checked={this.props.typeOfParsing === 0}
                      onChange={this.onParsingChoice}
                       id="test2" />
                    <label htmlFor="test2">Object value space</label>
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
                       checked={this.props.typeOfOutput === 1}
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
                      checked={this.props.typeOfOutput === 0}
                      onChange={this.onOutputChoice}
                       id="test4" />
                    <label htmlFor="test4">Minified Array</label>
                  </p>
                </form>
                <br/>
              </div>

            </div>

            <div className="col s12 l3 offset-l1 m4 inputDiv">
              <div className="row">
                <div className="col s12"><br/></div>
                <div className="col s12 fileBox">
                  <form action="#" id="formInputFile">
                    <div className="file-field input-field">
                      <div className="btn">
                        <span>File <i class="material-icons iconMiddle">cloud_upload</i> </span>
                        <input type="file" id="files" name="files[]" onChange={this.handleFileSelectedCsvJson} value={this.file} />
                      </div>
                      <div className="file-path-wrapper">
                        <input className="file-path" type="text" placeholder="Upload your csv file" value={this.props.fileObject.name} />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className={"col l3 m3 offset-m1 s12 " + (this.props.fileJsonCreated===0?'show':'unshow')}>
              <br/><br/>
              <center>
              <a className="waves-effect waves-light btn" onClick={this.convertToJSON}><i className="material-icons right">keyboard_arrow_right</i>Convert</a>
              </center>
            </div>
            <div className={"col l3  m3 offset-m1 s12 " +(this.props.fileJsonCreated===1?'show':'unshow')}>
              <br/><br/>
              <center>
                <DownloadLink  style={downloadLinkStyle} label="Download JSON" className="waves-effect waves-light btn" filename="sample.json"  exportFile={() => this.props.csvToJsonvalues}>
                </DownloadLink>
              </center>
            </div>

            <div className="col s12">
              <br/>
            </div>
            <div className="col s12 l4 offset-l1 m4 offset-m1 inputDiv">
                <br/>
                <label htmlFor="textarea1" className="normalText">Or paste your CSV here</label>
                <br/><br/>
                <textarea id="textarea1"  style={divStyle} rows="100" cols="50"  value={this.props.csvInputText} onChange={(event)=>{this.props.setcsvInputText(event.target.value)}} ></textarea>
                <br/>
            </div>

            <div className="col s12 l2 ">
              <br/>
              <br/>
              <center>
                <a className="waves-effect waves-light btn" onClick={this.convertTextAreatoJSON}><i className="material-icons right">keyboard_arrow_right</i>Convert</a>
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
                <label htmlFor="showTree" className="normalText"> JSON </label>
              </div>
              <div className={"col s4 " + (this.props.jsonOutputText===""?'unshow':'show')}>
                <CopyToClipboard text={this.props.jsonOutputText}>
                  <button class="waves-effect waves-light btn " style={buttonStyle}><i class="material-icons left">content_copy</i></button>
                </CopyToClipboard>
              </div>
              <div className="col s12">
                <br/>
              </div>
              <textarea style={divStyle}  id="textarea2"  rows="100" cols="50" value={this.props.jsonOutputText} ></textarea>
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
