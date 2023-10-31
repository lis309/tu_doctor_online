import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';

const Registration = ({ history }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.nombre === '' || formData.apellido === '' || formData.email === '' || formData.password === '') {
            setError('Todos los campos son obligatorios');
        } else if (formData.password.length < 6) {
            setError('La contraseña debe contener al menos 6 caracteres');
        } else {
            try {
                const { nombre, apellido, email, password } = formData;
                await axios.post('http://localhost:5000/user/', { nombre, apellido, email, password });

                // Si la solicitud es exitosa, navega a la ruta de éxito
                history.push('/'); // Reemplaza '/ruta-de-exito' con la ruta que desees
            } catch (error) {
                console.error('Error al registrar', error.response.data);
            }
        }
    };


    return (
        <div className="login-box mx-auto mt-5">
            <div className="login-logo">
                <Link to="#"><b>Registrar</b> Cuenta</Link>
            </div>
            <div className="card">
                <div className="card-body login-card-body">
                    <p className="login-box-msg">Bienvenido, ingrese sus credenciales</p>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                            />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                <i className="fas fa-user" />
                                </div>
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" 
                                className="form-control" 
                                placeholder="Apellido" 
                                name='apellido'
                                value={formData.apellido}
                                onChange={handleChange}/>
                            <div className="input-group-append">
                                <div className="input-group-text">
                                <i className="fas fa-user" />
                                </div>
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <input type="email" 
                                className="form-control" 
                                placeholder="Email" 
                                name='email'
                                value={formData.email}
                                onChange={handleChange}/>
                            <div className="input-group-append">
                                <div className="input-group-text">
                                <span className="fas fa-envelope" />
                                </div>
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <input type="password" 
                                className="form-control" 
                                placeholder="Password"
                                name='password'
                                value={formData.password}
                                onChange={handleChange}/>
                            <div className="input-group-append">
                                <div className="input-group-text">
                                <span className="fas fa-lock" />
                                </div>
                            </div>
                        </div>
                        {error && <p className="text-danger">{error}</p>}
                        <div className="social-auth-links text-center mb-3">
                            <button type="submit" to="" className="btn btn-block btn-primary">
                                <i /> Crear cuenta
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default withRouter(Registration);
