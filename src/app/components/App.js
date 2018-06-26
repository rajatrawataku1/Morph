import React from "react"
import Layout from "./Layout"
import '../assets/styles/app.scss';
require("../assets/js/jsonTree.js");

export default class App extends React.Component {
  render() {
    return <div>
      <Layout />
    </div>
  }
}
