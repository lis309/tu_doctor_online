import React, {Fragment} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Paginas/auth/login.JS';
import Dashboard from './Paginas/auth/dashboard';
import Registration from './Paginas/auth/registration';

function App() {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path='/' exact element = {<Login/>}></Route>
          <Route path='/dashboard' exact element = {<Dashboard/>}></Route>
          <Route path='/registro' exact element = {<Registration/>}></Route>
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
