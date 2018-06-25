import React, {PropTypes} from "react"
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { setColoumnHead, setCSVUploaded, setJSONCreated, setJSONCreatedText, setValues,setStatus } from '../../actions/index.js';
import '../../assets/styles/csvToJson.css';
import '../../assets/styles/mate_icon.css';

export class CSVtoJSON extends React.Component {

  constructor(props) {
    super(props)
    this.state = { typeOfParsing : "Object value null"};
    this.handleFileSelectedCsvJson = this.handleFileSelectedCsvJson.bind(this);
    this.processDataCsvJson = this.processDataCsvJson.bind(this);
    this.loadHandlerCsvJson = this.loadHandlerCsvJson.bind(this);
    this.downloadJSON = this.downloadJSON.bind(this);
    this.creatDownloadLink = this.creatDownloadLink.bind(this);
    this.convertTextAreatoJSON = this.convertTextAreatoJSON.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.removeAllText = this.removeAllText.bind(this);
    this.onParsingChoice = this.onParsingChoice.bind(this);
  }


  onParsingChoice(event){
    let value = event.currentTarget.value;
    this.setState({typeOfParsing : value});
    this.props.setJSONCreated(0);
    $("#formInputFile")[0].reset();
    // $(".fileBox").empty();
    // $(".fileBox").append('<div className="file-field input-field"> <div className="btn"> <span>File <i class="material-icons iconMiddle">cloud_upload</i> </span> <input type="file" id="files" name="files[]" onChange={this.handleFileSelectedCsvJson} multiple /> </div> <div className="file-path-wrapper"> <input className="file-path validate" type="text" placeholder="Upload your csv file"/> </div> </div>');
  }

  handleFileSelectedCsvJson = (event)=>{

    event.stopPropagation();
    event.preventDefault();
    this.props.setCSVUploaded(1);
    console.log("It shoudl re render");
    this.props.setJSONCreated(0);
    this.props.setJSONCreatedText(0);

    let files = event.target.files;
    if(files.length>0){
      // console.log(files);
      // console.log(files[0].name);
      // read the file
      $(".loaderBox").removeClass("unshow");
      let reader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = this.loadHandlerCsvJson;
    }else{
      console.log("No file Selected");
    }
  }

  loadHandlerCsvJson = ()=>{
    this.props.setCSVUploaded(1);
    this.setState({
      status:"STARTED"
    });
    console.log('status', this.state.status);
    // this.setState( {csvUploaded: 1});
    let csv = event.target.result;
    this.processDataCsvJson(csv);
  }

  createTheJsonTree(completeObject){
    console.log("I am called");
    var wrapper = document.getElementById("showTree");
    var tree = jsonTree.create(completeObject, wrapper);
    tree.expand(function(node) {
       return node;
    });
    console.log(tree);
  }

  processDataCsvJson = (csv,typeOfRequest=0)=>{
    // String.split("[\\r\\n]+")
    if(csv ===""){
      alert("File is Empty");
      return;
    }else{
      // console.log(csv);
      let allCsvRows = csv.split(/\r\n|\n/);

      // console.log("Number of Rows  : "+allCsvRows.length);

        let  getSingleObject = (allText,coloumnHeadArray)=>{
              return new Promise( (resolve,reject)=>{
                let SingleJSONObject = {};
                let arrayLength = allText.length;
                let iteratorCheck = coloumnHeadArray.length;
                let temp_state= coloumnHeadArray;

                allText.some( (text,index) =>{
                  if(text===""){
                    if(this.state.typeOfParsing === "Object value space"){
                      SingleJSONObject[temp_state[index]] = "";
                    }else{
                      SingleJSONObject[temp_state[index]] = null;
                    }
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
              let coloumnHeadArray=[];
              // console.log(allCsvRows);
              allCsvRows.forEach( (row,index) =>{
                  if(index === 0){
                    let coloumnHeads = row.split(/,/);
                    this.props.setColoumnHead(coloumnHeads);
                    coloumnHeadArray=coloumnHeads;
                    // this.setState({coloumnHead:coloumnHeads});
                  }else{
                    let allText = row.split(/,/);
                    getSingleObject(allText,coloumnHeadArray).then( (SingleJSONObject) =>{
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
          $(".loaderBox").addClass("unshow");
          if(typeOfRequest===1){
            this.createTheJsonTree(CompleteJSONObject);
            this.props.setJSONCreatedText(1);
          }else{
            this.props.setJSONCreated(1);
          }
          this.setState({status:"COMPLETE"});
          this.props.setStatus("COMPLETE");
          // this.setState ( { values : CompleteJSONObject });
          // this.setState ( { jsonCreated : 1});
        })

    }
}

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

  downloadJSON = ()=>{

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

  convertTextAreatoJSON = () =>{

      // this.setState({hey:"1234"}, ()=>{
      //   console.log(this.state.hey);
      // });
      // this.setState({status:"Rajat"});
      // console.log(this.state.hey);
      // this.props.setCSVUploaded(1);
      // this.props.setJSONCreated(1);
      // console.log(this.props.jsonCreated);
      // this.props.setCSVUploaded(1);
      let textAreaString = $("#textarea1").val();
      this.processDataCsvJson(textAreaString,1);
  }

  copyToClipboard(){

    var textArea = document.createElement("textarea");
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
      console.log('Copying text command was ' + msg);
    } catch (err) {
      console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);

  }

  removeAllText(){
    this.props.setJSONCreatedText(0);
    $("#textarea1").val("");
    $("#showTree").empty();
  }

  componentWillMount = ()=> {

  }

  componentWillReceiveProps = (nextProps) =>{
    console.log('nextProps',nextProps);
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

    console.log('render');
    // console.log(this.state.status);
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

            <div className="col l2 offset-l1  s12 inputDiv">
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

            <div className="col s12 l4 offset-l1 m4 inputDiv">
              <div className="row">
                <div className="col s12"><br/></div>
                <div className="col s12 fileBox">
                  <form action="#" id="formInputFile">
                    <div className="file-field input-field">
                      <div className="btn">
                        <span>File <i class="material-icons iconMiddle">cloud_upload</i> </span>
                        <input type="file" id="files" name="files[]" onChange={this.handleFileSelectedCsvJson} />
                      </div>
                      <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" placeholder="Upload your  csv file"/>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className={"col l3 offset-l1 m3 offset-m1 s12 " +(this.props.jsonCreated===1?'show':'unshow')}>
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
