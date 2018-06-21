import React, { PropTypes } from "react"
import { connect } from "react-redux"
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

// @connect((store) => {
//   return {
//
//   };
// })

export default class First extends React.Component {

  constructor(props) {
    super(props)
  }

  downloadJSON(){
      // create the file first
      if( 'Blob' in window){
        let fileName = prompt('Please enter file name to save', 'Untitled.json');
        if(fileName){

          let dataToWrite= this.props.values;
          let TotalData="[";

          let dataToWriteLength = dataToWrite.length;
          dataToWrite.forEach( (data,index)=>{
            if(index === dataToWriteLength -1){
              TotalData=TotalData+ JSON.stringify(data) + "]";
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
            }else{
              TotalData=TotalData+ JSON.stringify(data) +",\n";
            }
          })
        }

      }
    }

    downloadJSON(){
      // create the file first
      if( 'Blob' in window){
        let fileName = prompt('Please enter file name to save', 'Untitled.json');
        if(fileName){

          let dataToWrite= this.props.values;
          let TotalData="[";

          let dataToWriteLength = dataToWrite.length;
          dataToWrite.forEach( (data,index)=>{
            if(index === dataToWriteLength -1){
              TotalData=TotalData+ JSON.stringify(data) + "]";
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
            }else{
              TotalData=TotalData+ JSON.stringify(data) +",\n";
            }
          })
        }

      }
    }

  componentWillMount() {

  }

  render() {
    return  <ReactCSSTransitionGroup
      transitionName="fade-in"
      transitionAppear={true}
      transitionAppearTimeout={500}
      transitionEnter={false}
      transitionLeave={false}>
        <div>
          Starter kit : {process.env.NODE_ENV}
        </div>
      </ReactCSSTransitionGroup>
  }
}
