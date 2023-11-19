import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Importa useNavigate en lugar de useHistory
import axios from 'axios';

const Registration = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        rol: 2
    });

    const [error, setError] = useState('');

    const navigate = useNavigate();  // Usa useNavigate en lugar de useHistory

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ((formData.nombre === '' || formData.apellido === '' || formData.email === '' || formData.password === '') && formData.rol === 2) {
            setError('Todos los campos son obligatorios');
        } else if (formData.password.length < 6) {
            setError('La contraseña debe contener al menos 6 caracteres');
        } else {
            try {
                const { nombre, apellido, email, password, rol } = formData; // Asegúrate de incluir 'rol' en la desestructuración
                await axios.post('http://localhost:5000/user/', { nombre, apellido, email, password, rol });

                // Restablecer el estado del formulario a sus valores iniciales
                setFormData({
                    nombre: '',
                    apellido: '',
                    email: '',
                    password: ''
                });

                // Limpiar cualquier mensaje de error
                setError('');

                alert('Registro exitoso!!');

                // Si la solicitud es exitosa, navega a la ruta de éxito
                navigate('/Login');  // Usa navigate en lugar de history.push

            } catch (error) {
                console.error('Error al registrar', error);
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
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Apellido"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                            />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <i className="fas fa-user" />
                                </div>
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <span className="fas fa-envelope" />
                                </div>
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <span className="fas fa-lock" />
                                </div>
                            </div>
                        </div>
                        {error && <p className="text-danger">{error}</p>}
                        <div className="social-auth-links text-center mb-3">
                            <button type="submit" className="btn btn-block btn-primary">
                                <i /> Crear cuenta
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Registration;
