import React, { PropTypes } from "react"
import { connect } from "react-redux"

export class Loader extends React.Component {
  constructor(props){
    super(props)
  }
  render(){

    let loaderStyle = {
      zIndex : "100"
    }

    return(

      <div style={loaderStyle} className={ "loaderBox " +this.props.status}>
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

    )

  }

}


const mapStateToProps = (state)=> {
  const { status } = state;
    return {
      status
    }
}

export default connect(mapStateToProps)(Loader);
