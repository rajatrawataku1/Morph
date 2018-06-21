import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import {HashRouter as Router, Route} from "react-router-dom";

import App from "./components/App"
import store from "./store"

const app = document.getElementById('app')

// store.subscribe(()=>{
//   localStorage.setItem('reduxState', JSON.stringify(store.getState()))
// })

ReactDOM.render(<Provider store={store}>
  <div>
    <Router>
      <App />
    </Router>
  </div>
</Provider>, app);
