import React from "react"
import {Switch, Route} from "react-router-dom";
import First from "./First"
import CSVtoJSON from './CSVtoJSON/index.js';
import JSONtoCSV from './JSONtoCSV/index.js';

export default class Layout extends React.Component {
  componentWillMount() {
  }

  render() {
    return <main>
      <Switch>
        <Route exact path='/' component={CSVtoJSON}/>
        <Route exact path='/second' component={JSONtoCSV}/>
      </Switch>
    </main>
  }
}
