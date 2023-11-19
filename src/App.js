import React, {Fragment} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Paginas/auth/paginaPrincipal'
import Login from './Paginas/auth/login';
import Registration from './Paginas/auth/registration';
import Dashboard from './Paginas/auth/dashboardPaciente';
import DashboardIPS from './Paginas/auth/dashboardIPS';



function App() {
  return (
    <Fragment>
      <Router>
        <Routes>
        <Route path='/' exact element = {<Home/>}></Route>
          <Route path='/Login' exact element = {<Login/>}></Route>
          <Route path='/Registro' exact element = {<Registration/>}></Route>
          <Route path='/dashboard' exact element = {<Dashboard/>}></Route>
          <Route path='/dashboardIPS' exact element = {<DashboardIPS/>}></Route>
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
