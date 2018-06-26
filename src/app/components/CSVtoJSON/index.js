import React, { PropTypes } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { setColoumnHead, setCSVUploaded, setJSONCreated, setJSONCreatedText, setValues,setStatus } from '../../actions/index.js';
import '../../assets/styles/csvToJson.css';
import '../../assets/styles/mate_icon.css';
import { jsonTree } from '../../assets/js/jsonTree.js';

//  pacakage to convert csv to json
const csvtojson=require("csvtojson");

//  conver the input file object into the file stream object
var fileReaderStream = require('filereader-stream');

export class CSVtoJSON extends React.Component {

  constructor(props) {
    super(props)
    this.state = { typeOfParsing : "Object value null",typeOfOutput:"Output Array", fileObject:""};
    this.handleFileSelectedCsvJson = this.handleFileSelectedCsvJson.bind(this);
    this.downloadJSON = this.downloadJSON.bind(this);
    this.creatDownloadLink = this.creatDownloadLink.bind(this);
    this.convertTextAreatoJSON = this.convertTextAreatoJSON.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.removeAllText = this.removeAllText.bind(this);
    this.onParsingChoice = this.onParsingChoice.bind(this);
    this.onOutputChoice = this.onOutputChoice.bind(this);
    this.getCurrrentParsingMethod = this.getCurrrentParsingMethod.bind(this);
    this.getCurrrentOutputMethod = this.getCurrrentOutputMethod.bind(this);
    this.convertToJSON = this.convertToJSON.bind(this);
  }

  // change the parsing choice whehter null or space
  onParsingChoice = (event)=>{
    let value = event.currentTarget.value;
    this.setState({typeOfParsing : value});
    this.props.setJSONCreated(0);
  }

  //  changing the type of output array or minified version
  onOutputChoice = (event)=>{
    let value = event.currentTarget.value;
    // console.log(value);
    this.setState({typeOfOutput : value});
    this.props.setJSONCreated(0);
  }

  //  this function is used to retrieve the value of type of parsing
  getCurrrentParsingMethod = ()=>{
    if(this.state.typeOfParsing === "Object value null"){
      return 1;
    }else{
      return 0;
    }
  }

  //  this function is used to retrive the value of type of output required
  getCurrrentOutputMethod = () =>{
    if(this.state.typeOfOutput === "Output Array"){
      return 1;
    }else{
      return 0;
    }
  }

  //  this is the actual function which is convertin the file selected to json
  convertToJSON = ()=>{
    let fileObject = this.state.fileObject;

    //  comparing the file obejct if its empty returning from here only
    if(fileObject===""){
      alert("No file Choosen");
    }else{

      //  show the loader now
      $(".loaderBox").removeClass("unshow");
      //  getting the initial configuration usin the various function
      //  completeObject which will contain the array of json in the end
      let completeObject =[];
      let currentState = this.getCurrrentParsingMethod();

      //  conerting the file object into file stream object
      let readStream = fileReaderStream(fileObject);

      //  if there is any error in the csv or we cant complete traverse the csv array then it
      //  is callled

      let onError = (e)=>{
          // console.log(e);
          $(".loaderBox").addClass("unshow");
          alert("Wrong CSV FILE");
      }

      //  when the whole csv array is traversed then this is called
      let onComplete = ()=>{
        //  setting the value array of the store
        this.props.setValues(completeObject);
        //  removing the loader now
        $(".loaderBox").addClass("unshow");
        //  setting the store variable that json is created
        this.props.setJSONCreated(1);
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
  handleFileSelectedCsvJson = (event)=>{
    event.stopPropagation();
    event.preventDefault();
    let files = event.target.files;
    this.setState({fileObject:files[0]});
  }

  // used for creating the json tree which is shown in the div with ID showTree
  createTheJsonTree = (completeObject)=>{
    var wrapper = document.getElementById("showTree");
    wrapper.innerHTML="";
    var tree = jsonTree.create(completeObject, wrapper);
    tree.expand(function(node) {
       return node;
    });
  }

  //  this creates the downlodable link its given the two Paramter
  //  TotalData which is the full string and fileName whih will be downloaded
  //  We need to optimize this

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
        let dataToWrite= this.props.values;
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
      }else{
        //  the output will be a minified version just directly use the native function
        let TotalData=JSON.stringify(dataToWrite);
        this.creatDownloadLink(TotalData,fileName);
      }
  }

  //  this convert the textarea csv to json by traversing each line one by one
  convertTextAreatoJSON = () =>{
      let textAreaString = $("#textarea1").val();
      csvtojson({
        noheader:true,
        output: "csv"
      })
      .fromString(textAreaString)
      .then((csvRow)=>{
      	// console.log(csvRow)
        let ColoumnHead = csvRow[0];
        let  currentState = this.getCurrrentParsingMethod();

        this.props.setColoumnHead(ColoumnHead);
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
         // console.log(result);
         this.props.setValues(result);
         this.props.setJSONCreatedText(1);
         this.createTheJsonTree(result);
       })

      })
  }

  //  copiying data to clipboard using the below function
  copyToClipboard(){
    let textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';

    textArea.value = JSON.stringify(this.props.values);
    document.body.appendChild(textArea);
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      // console.log('Copying text command was ' + msg);
      Materialize.toast('JSON Copied to Clipboard', 2000) // 'rounded' is the class I'm applying to the toast
    } catch (err) {
      // console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);

  }

  // clearing both the divs by using this function
  removeAllText(){
    //  jsonCreatedText is set to 0 so that there is no option to copy
    this.props.setJSONCreatedText(0);
    $("#textarea1").val("");
    $("#showTree").empty();
  }

  componentWillMount = ()=> {
    // console.log("Component will mount is called");
    // this.props.setJSONCreatedText(0);
  }

  componentWillReceiveProps = (nextProps) =>{
    // console.log('nextProps',nextProps);
  }


  render() {

    var divStyle = {
      height:"18rem",
      border:"none",
      outline:"none",
      backgroundColor:"#f0f0f0",
      borderRadius:"5px",
      padding:"10px",
      overflow:"scroll"
    };

    var buttonStyle = {
      paddingLeft :"10px",
      paddingRight : "1px"
    }

    var loaderStyle = {
      zIndex : "100"
    }

      return(
        <div className="mainApp" >
          <div style={loaderStyle} className="loaderBox unshow">
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
                       checked={this.state.typeOfParsing === "Object value null"}
                       onChange={this.onParsingChoice}
                       id="test1"
                     />
                    <label for="test1">Object value null</label>
                  </p>
                  <p>
                    <input class="with-gap"
                      name="group1"
                      type="radio"
                      value="Object value space"
                      checked={this.state.typeOfParsing === "Object value space"}
                      onChange={this.onParsingChoice}
                       id="test2" />
                    <label for="test2">Object value space</label>
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
                       checked={this.state.typeOfOutput === "Output Array"}
                       onChange={this.onOutputChoice}
                       id="test3"
                     />
                    <label for="test3">Array</label>
                  </p>
                  <p>
                    <input class="with-gap"
                      name="group2"
                      type="radio"
                      value="Output minified Array"
                      checked={this.state.typeOfOutput === "Output minified Array"}
                      onChange={this.onOutputChoice}
                       id="test4" />
                    <label for="test4">Minified Array</label>
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
                        <input className="file-path validate" type="text" placeholder="Upload your  csv file"/>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className={"col l3 m3 offset-m1 s12 " + (this.props.jsonCreated===0?'show':'unshow')}>
              <br/><br/>
              <center>
              <a className="waves-effect waves-light btn" onClick={this.convertToJSON}><i className="material-icons right">keyboard_arrow_right</i>Convert</a>
              </center>
            </div>
            <div className={"col l3  m3 offset-m1 s12 " +(this.props.jsonCreated===1?'show':'unshow')}>
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
                <label for="textarea1" className="normalText">Or paste your CSV here</label>
                <br/><br/>
                <textarea id="textarea1"  style={divStyle} rows="100" cols="50"></textarea>
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
                <label for="showTree" className="normalText"> JSON </label>
              </div>
              <div className={"col s4 " + (this.props.jsonCreatedText===1?'show':'unshow')}>
                <a class="waves-effect waves-light btn tooltipped" style={buttonStyle} data-position="bottom" data-delay="50" data-tooltip="Copy to Clipboard" onClick={this.copyToClipboard} ><i class="material-icons left">content_copy</i></a>
              </div>
              <div className="col s12">
                <br/>
              </div>
              <div  id="showTree"  style={divStyle} ></div>
              <br/>
            </div>
          </div>
        </div>
      )
    }
}

const mapStateToProps = (state)=>{
    return {
      columnName : state.columnName ,
      values : state.values,
      csvUploaded : state.csvUploaded,
      jsonCreated : state.jsonCreated,
      status : state.status,
      jsonCreatedText : state.jsonCreatedText
    }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setColoumnHead : setColoumnHead ,
      setCSVUploaded : setCSVUploaded,
      setJSONCreated : setJSONCreated,
      setValues : setValues,
      setStatus : setStatus,
      setJSONCreatedText : setJSONCreatedText
    },dispatch)
};

export default connect(mapStateToProps,mapDispatchToProps)(CSVtoJSON);
