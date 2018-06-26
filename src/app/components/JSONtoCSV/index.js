import React, {PropTypes} from "react"
import { connect } from "react-redux"
import { bindActionCreators } from 'redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { setColoumnHead, setJSONUploaded, setCSVCreated ,setValues, setCSVCreatedText } from '../../actions/index.js';


export class JSONtoCSV extends React.Component {

  constructor(props) {
    super(props)
    this.handleFileSelectedJsonCsv = this.handleFileSelectedJsonCsv.bind(this);
    this.processDataJsonCsv = this.processDataJsonCsv.bind(this);
    this.loadHandlerJsonCsv = this.loadHandlerJsonCsv.bind(this);
    this.downloadCSV = this.downloadCSV.bind(this);
    this.creatDownloadLink = this.creatDownloadLink.bind(this);
    this.removeAllText = this.removeAllText.bind(this);
    this.convertTextAreatoCSV = this.convertTextAreatoCSV.bind(this);
    this.pasetTheCSV = this.pasetTheCSV.bind(this);
    this.copyCSVClipboard = this.copyCSVClipboard.bind(this);
  }

  convertTextAreatoCSV(){
    let textAreaString = $("#textarea3").val();
    this.processDataJsonCsv(textAreaString,1);
  }

  handleFileSelectedJsonCsv(event){
    event.stopPropagation();
    event.preventDefault();
    this.props.setJSONUploaded(0);
    this.props.setCSVCreated(0);
    this.props.setCSVCreatedText(0);
    // this.setState( {csvUploaded: 0});
    // this.setState( {jsonCreated : 0});

    let files = event.target.files;
    if(files.length>0){
      // console.log(files);
      // console.log(files[0].name);
      // read the file
      $(".loaderBox").removeClass("unshow");
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

  processDataJsonCsv(json,typeOfRequest=0){

    let getCompleteCSV = (jsonObjectMain)=>{
      return new Promise( (resolve,reject)=>{
        let mainString ="";
        let jsonObjectMainLength = jsonObjectMain.length;
        jsonObjectMain.forEach( (singleObject,index) =>{

            //  coloumnHeads check is required
            let tempColoumnHead =Object.keys(singleObject);
            // console.log(singleObject);
            // console.log(tempColoumnHead);
            if( tempColoumnHead.length > this.props.columnName.length && index !=0){
              let coloumnHeads = Object.keys(singleObject);
              this.props.setColoumnHead(coloumnHeads);
              let StringAfterFirstRow = mainString.substr(mainString.indexOf("\n"));
              // console.log("StringAfterFirstRow : "+StringAfterFirstRow);
              let newFirstRowString = coloumnHeads.toString();
              // console.log("Before : "+mainString);
              mainString = newFirstRowString + StringAfterFirstRow;
              // console.log("After : "+mainString);
              // console.log(oldFirstRowString);
              // console.log(newFirstRowString);
              // console.log("Before : "+mainString);
              // mainmainString.replace(oldFirstRowString,newFirstRowString);
              // console.log("After : "+mainString);
              //  will have to chanage first line
            }

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
          $(".loaderBox").addClass("unshow");

          if(typeOfRequest===1){
            this.pasetTheCSV(mainCSVString);
            this.props.setCSVCreatedText(1);
          }else{
            this.props.setCSVCreated(1);
          }

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

  removeAllText(){
    this.props.setCSVCreatedText(0);
    $("#textarea3").val("");
    $("#textarea4").val("");
  }

  pasetTheCSV(csvMainString){
    $("#textarea4").val(csvMainString);
  }

  copyCSVClipboard(){
    var copyText = $("#textarea4").val();

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

    textArea.value = copyText;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      // console.log('Copying text command was ' + msg);
    } catch (err) {
      // console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
  }

  componentWillMount() {

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

    return (

      <div className="mainApp" >
        <div style= {loaderStyle} className="loaderBox unshow">
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
                    <input type="file" id="files" name="files[]" onChange={this.handleFileSelectedJsonCsv} multiple />
                  </div>
                  <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" placeholder="Upload your  JSON file"/>
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
              <label for="textarea3" className="normalText">Or paste your JSON here</label>
              <br/><br/>
              <textarea id="textarea3"  style={divStyle} rows="100" cols="50"></textarea>
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
              <label for="showTree" className="normalText"> CSV </label>
            </div>
            <div className={"col s4 " + (this.props.csvCreatedText===1?'show':'unshow')}>
              <a class="waves-effect waves-light btn tooltipped" style={buttonStyle} data-position="bottom" data-delay="50" data-tooltip="Copy to Clipboard" onClick={this.copyCSVClipboard} ><i class="material-icons left">content_copy</i></a>
            </div>
            <div className="col s12">
              <br/>
            </div>
            <textarea id="textarea4"  style={divStyle} rows="100" cols="50"></textarea>
            {/* <div  id="showTree"  style={divStyle} ></div> */}
            <br/>
          </div>

        </div>
      </div>
    )
  }
}

function mapStateToProps(state){
    return {
      columnName : state.columnName ,
      values : state.values,
      csvCreated : state.csvCreated,
      jsonUploaded : state.jsonUploaded,
      csvCreatedText : state.csvCreatedText
    }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setColoumnHead : setColoumnHead ,
      setCSVCreated : setCSVCreated,
      setJSONUploaded : setJSONUploaded,
      setValues : setValues,
      setCSVCreatedText : setCSVCreatedText
    },dispatch)
};

export default connect(mapStateToProps,mapDispatchToProps)(JSONtoCSV);
