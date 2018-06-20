import React, {PropTypes} from "react"
import { connect } from "react-redux"
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

@connect((store) => {
  return {

  };
})
export default class First extends React.Component {
  constructor(props) {
    super(props)
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
