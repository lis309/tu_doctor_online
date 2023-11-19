import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../css/login.css";

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (formData.email === '' || formData.password === '') {
            setError('Todos los campos son obligatorios');
        } else if (formData.password.length < 6) {
            setError('La contraseña debe contener al menos 6 caracteres');
        } else {
            try {
                const { email, password } = formData;
                const response = await axios.get(`http://localhost:5000/user?email=${email}&password=${password}`);
    
                console.log(response);
    
                if (response.data.length > 0) {
                    const user = response.data[0];
                    // Verifica el rol del usuario
                    if (user.rol === 1) {
                        // Redirige al usuario con rol 1 a la ruta '/dashboardIPS'
                        navigate('/dashboardIPS');
                    } else if (user.rol === 2) {
                        // Redirige al usuario con rol 2 a la ruta '/dashboard'
                        navigate('/dashboard');
                    }
                    alert('Inicio de sesión exitoso!!');
                } else {
                    setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
                }
    
            } catch (error) {
                setError('Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.');
            }
        }
    };
    

    return (
        <div className="login-box mx-auto mt-5">
            <div className="login-logo">
                <Link to="#"><b>Iniciar</b> Sesión</Link>
            </div>
            <div className="card">
                <div className="card-body login-card-body">
                    <p className="login-box-msg">Bienvenido, ingrese sus credenciales</p>
                    <form onSubmit={handleSubmit}>
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
                                <i /> Ingresar
                            </button>
                            <Link to="/Registro" className="btn btn-block btn-danger">
                                <i /> Crear cuenta
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
