import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Estilos predeterminados de react-datepicker

const Dashboard = () => {
    return (
        <div className="wrapper">
            {/* Main Sidebar Container */}
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                {/* ... Contenido del menú lateral ... */}
            </aside>
            {/* Content Wrapper. Contains page content */}
            <div className="content-wrapper">
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-6 mx-auto mt-5"> {/* Agregar la clase mx-auto para centrar y mt-4 para margen superior */}
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Agendar Cita</h3>
                                    </div>
                                    <div className="card-body">
                                        {/* Calendario para seleccionar la fecha */}
                                        <div className="input-group">
                                          <div className="input-group-prepend">
                                            <span className="input-group-text">
                                              <i className="far fa-calendar"></i>
                                            </span>
                                          </div>
                                          <DatePicker
                                            className="form-control"
                                            placeholderText="Seleccionar fecha"
                                          />
                                        </div>
                                        <br />
                                        {/* Selector de hora */}
                                        <div className="form-group">
                                            <label>Seleccionar hora:</label>
                                            <select className="form-control">
                                                <option value="9:00 AM">9:00 AM</option>
                                                <option value="10:00 AM">10:00 AM</option>
                                                <option value="11:00 AM">11:00 AM</option>
                                                {/* Agrega más opciones de hora según tus necesidades */}
                                            </select>
                                        </div>
                                        <br />
                                        {/* Campo para ingresar el número de autorización (cambiado a type="number") */}
                                        <div className="form-group">
                                            <label>Número de Autorización:</label>
                                            <input type="number" className="form-control" placeholder="Ingresa tu número de autorización" />
                                        </div>
                                        <br />
                                        <button className="btn btn-primary">Agendar Cita</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Dashboard;
