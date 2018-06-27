import React, { PropTypes } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import { setCsvToJsonFileObject,  setfileJsonCreated,  setCsvToJsonValues, setcsvInputText,  setjsonOutputText, setTypeOfParsing, setTypeOfOutput } from '../../actions/index.js';
import  csvtojson  from 'csvtojson';
import  fileReaderStream from 'filereader-stream';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import '../../assets/styles/csvToJson.scss';
import '../../assets/styles/mate_icon.scss';

export class CSVtoJSON extends React.Component {

  constructor(props) {
    super(props)
  }

  // change the parsing choice whehter null or space
  onParsingChoice = (event)=>{
    let value = event.currentTarget.value;
    this.props.setTypeOfParsing(value);
    this.props.setfileJsonCreated(0);
    this.props.setjsonOutputText("");
  }

  //  changing the type of output array or minified version
  onOutputChoice = (event)=>{
    let value = event.currentTarget.value;
    this.props.setTypeOfOutput(value);
    this.props.setfileJsonCreated(0);
    this.props.setjsonOutputText("");
  }

  //  this function is used to retrieve the value of type of parsing
  getCurrrentParsingMethod = ()=>{
    if(this.props.typeOfParsing === "Object value null"){
      return 1;
    }else{
      return 0;
    }
  }

  //  this function is used to retrive the value of type of output required
  getCurrrentOutputMethod = () =>{
    if(this.props.typeOfOutput === "Output Array"){
      return 1;
    }else{
      return 0;
    }
  }

  //  this is the actual function which is convertin the file selected to json
  convertToJSON = ()=>{
    let fileObject = this.props.fileObject;
    //  comparing the file obejct if its empty returning from here only
    if(fileObject.name===""){
      alert("No file Chosen");
    }else{

      //  show the loader now
      let loaderElement = this.refs.loaderDiv;
      loaderElement.setAttribute("style","display:block");
      let completeObject =[];
      let currentState = this.getCurrrentParsingMethod();

      //  conerting the file object into file stream object
      let readStream = fileReaderStream(fileObject);

      //  if there is any error in the csv or we cant complete traverse the csv array then it is called

      let onError = (e)=>{
        let loaderElement = this.refs.loaderDiv;
        loaderElement.setAttribute("style","display:none");
          alert("Wrong CSV FILE");
      }

      //  when the whole csv array is traversed then this is called
      let onComplete = ()=>{
        //  setting the value array of the store
        this.props.setCsvToJsonValues(completeObject);
        //  removing the loader now
        let loaderElement = this.refs.loaderDiv;
        loaderElement.setAttribute("style","display:none");
        //  setting the store variable that json is created
        this.props.setfileJsonCreated(1);
      }

      //  libraty function which reads every line from csv and give correspodig json
      csvtojson().fromStream(readStream)
        .subscribe((json)=>{
          //  comparing the current state if its 1 then change the empty values to null
          //  if its value then in the output file the space will be shown for the values

          if(currentState){
            let keysArray = Object.keys(json);
            keysArray.forEach( (key)=>{
              if (json[key]===""){
                json[key]=null;
              }
            })
            completeObject.push(json);
          }else{
            completeObject.push(json);
          }

        },onError,onComplete);
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

    if(this.checkFileType(files[0].name)){
      if(files.length > 0){
        this.props.setCsvToJsonFileObject(files[0]);
      }else{
        this.props.setCsvToJsonFileObject({name:""});
      }
      this.props.setfileJsonCreated(0);
    }else{
      alert("Wrong file Selected");
    }
  }

  // used for creating the json tree which is shown in the div with ID showTree
  createTheJsonText = (completeObject)=>{

    let value = this.getCurrrentOutputMethod();
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

  creatDownloadLink = (TotalData,fileName) =>{
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

  //  this function will promp user to input file name
  downloadJSON = ()=>{
    if( 'Blob' in window){
      let fileName = prompt('Please enter file name to save', 'Untitled.json');
      if(fileName){
        let dataToWrite= this.props.csvToJsonvalues;
        if(dataToWrite.length === 0){
          // if the file is empty we directly write to it
          let TotalData="[]";
          this.creatDownloadLink(TotalData,fileName);
        }else{
          //  we create the outpute text according the selection of the user
          this.createOutputType(dataToWrite,fileName);
        }
      }
    }
  }

  // function creates the TotalData according to the user option minified or an array of object
  createOutputType = (dataToWrite,fileName)=>{
      let value = this.getCurrrentOutputMethod();
      if(value){
        //  the output will be an array
        let TotalData=JSON.stringify(dataToWrite,null,4);
        this.creatDownloadLink(TotalData,fileName);
      }else{
        //  the output will be a minified version just directly use the native function
        let TotalData=JSON.stringify(dataToWrite);
        this.creatDownloadLink(TotalData,fileName);
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
        let  currentState = this.getCurrrentParsingMethod();
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

    let loaderStyle = {
      zIndex : "100"
    }

      return(
        <div className="mainApp" >
          <div style={loaderStyle} className="loaderBox unshow" ref="loaderDiv" >
            <div className="preloader-wrapper big active">
            <div className="spinner-layer spinner-blue">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div><div className="gap-patch">
                <div className="circle"></div>
              </div><div className="circle-clipper right">
                <div className="circle"></div>
              </div>
            </div>

            <div className="spinner-layer spinner-red">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div><div className="gap-patch">
                <div className="circle"></div>
              </div><div className="circle-clipper right">
                <div className="circle"></div>
              </div>
            </div>

            <div className="spinner-layer spinner-yellow">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div><div className="gap-patch">
                <div className="circle"></div>
              </div><div className="circle-clipper right">
                <div className="circle"></div>
              </div>
            </div>

            <div className="spinner-layer spinner-green">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div><div className="gap-patch">
                <div className="circle"></div>
              </div><div className="circle-clipper right">
                <div className="circle"></div>
              </div>
            </div>
          </div>
        </div>

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
                       value="Object value null"
                       checked={this.props.typeOfParsing === "Object value null"}
                       onChange={this.onParsingChoice}
                       id="test1"
                     />
                    <label htmlFor="test1">Object value null</label>
                  </p>
                  <p>
                    <input class="with-gap"
                      name="group1"
                      type="radio"
                      value="Object value space"
                      checked={this.props.typeOfParsing === "Object value space"}
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
                       value="Output Array"
                       checked={this.props.typeOfOutput === "Output Array"}
                       onChange={this.onOutputChoice}
                       id="test3"
                     />
                    <label htmlFor="test3">Array</label>
                  </p>
                  <p>
                    <input class="with-gap"
                      name="group2"
                      type="radio"
                      value="Output minified Array"
                      checked={this.props.typeOfOutput === "Output minified Array"}
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
                        <input className="file-path" type="text" placeholder="Upload your csv file" defaultValue={this.props.fileObject.name} />
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
              <a className="waves-effect waves-light btn" onClick={this.downloadJSON}><i className="material-icons right">cloud_download</i>Download JSON</a>
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
    return {
      csvToJsonvalues : state.csvToJsonvalues,
      fileJsonCreated : state.fileJsonCreated,
      fileObject : state.fileObject,
      csvInputText : state.csvInputText,
      jsonOutputText : state.jsonOutputText,
      typeOfParsing : state.typeOfParsing,
      typeOfOutput : state.typeOfOutput
    }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setfileJsonCreated : setfileJsonCreated,
      setCsvToJsonValues : setCsvToJsonValues,
      setcsvInputText : setcsvInputText,
      setjsonOutputText : setjsonOutputText,
      setCsvToJsonFileObject : setCsvToJsonFileObject,
      setTypeOfParsing : setTypeOfParsing,
      setTypeOfOutput : setTypeOfOutput
    },dispatch)
};

export default connect(mapStateToProps,mapDispatchToProps)(CSVtoJSON);
