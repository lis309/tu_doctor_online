import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "../../css/paginaPrincipal.css";

const Home = () => {
  const [doctorsData, setDoctorsData] = useState([]);


  useEffect(() => {

    // Simulación de datos de médicos con rutas relativas
    const mockDoctors = [
      { id: 1, nombre: "Carlos González", imagen: "/images/doctor1.jpg" },
      { id: 2, nombre: "María Martínez", imagen: "/images/doctor2.jpg" },
      { id: 3, nombre: "Jorge Ramírez", imagen: "/images/doctor3.jpg" },
    ];

    setDoctorsData(mockDoctors);
  }, []);

  return (
    <div className="main-container">
        <header>
        <div className="carrusel">
            <Link to="/Login" className="login-link">Iniciar Sesión</Link>
            <div className="slide">
            <h1>Bienvenido a</h1>
            <br />
            <h2>IPS Salud para Todos</h2>
            </div>
        </div>
        <svg viewBox="0 0 500 150" preserveAspectRatio="none"
            style={{ height: '20%', width: '100%', position: 'absolute', bottom: 0, left: 0 }}>
            <path d="M0.00,49.98 C150.00,150.00 349.20,-50.00 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
            style={{ stroke: 'none', fill: '#f0f0f0' }} />
        </svg>
        </header>
        <div className="titulo1">
            <h2>IPS Salud para Todos</h2>
        </div>
        <section className="informacion">
            <p>Bienvenido a la IPS Salud para Todos 
                En Salud para Todos, nos dedicamos a proporcionar atención médica integral y personalizada para satisfacer las necesidades de nuestra comunidad. 
                Nuestra misión es brindar servicios de salud de alta calidad, centrados en el paciente y respaldados por un equipo de profesionales médicos altamente calificados.
            </p>
            <img src="/images/info.jpg" alt=""/>
        </section>
        <div className="titulo2">
                <h2>Nuestros doctores</h2>
            </div>
        <section className="doctores">
            {doctorsData.map((doctor) => (
            <div key={doctor.id} className="doctor">
                <img src={doctor.imagen} alt={`Doctor ${doctor.id}`} />
                <h3>{`Dr. ${doctor.nombre} `}</h3>
            </div>
            ))}
        </section>
    </div>
  );
};

export default Home;
