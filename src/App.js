import React, {Fragment} from 'react';
import {BroserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import Login from './Paginas/login.JS';

function App() {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path='/' exact element = {<Login/>}>

          </Route>
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
