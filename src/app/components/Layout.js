import React from "react"
import {Switch, Route} from "react-router-dom";
import First from "./First"

export default class Layout extends React.Component {
  componentWillMount() {

  }
  render() {
    return <main>
      <Switch>
        <Route exact path='/' component={First}/>
        {/* <Route exact path='/' component={Second}/> */}
      </Switch>
    </main>
  }
}
