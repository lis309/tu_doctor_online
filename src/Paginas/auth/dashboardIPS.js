import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../css/estilosIPS.css";

const DashboardIPS = () => {
  const [isListVisible, setListVisible] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState({});
  const [error, setError] = useState("");
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentsResponse = await fetch("http://localhost:5000/Cita");
        const doctorsResponse = await fetch("http://localhost:5000/Medico");

        if (!appointmentsResponse.ok || !doctorsResponse.ok) {
          console.error("Error al obtener datos de la API.");
          return;
        }

        const doctorsData = await doctorsResponse.json();

        setDoctors(doctorsData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);
  

  const toggleNotifications = async () => {
    try {
  
      const updatedAppointmentsResponse = await fetch("http://localhost:5000/Cita");
      const updatedAppointmentsData = await updatedAppointmentsResponse.json();
  
      const currentDate = new Date().toISOString().split("T")[0];
      const filteredAppointments = [];
  
      for (const appointment of updatedAppointmentsData) {
        if (appointment.fecha >= currentDate && appointment.estado === "En espera") {
          filteredAppointments.push(appointment);
        }
      }

      const hasNewAppointments = filteredAppointments.length > 0;
      
      // Mostrar notificaciones
      setShowNotifications(hasNewAppointments);
  
      // Mostrar mensaje adicional si hay nuevas citas
      if (hasNewAppointments) {
        setNotificationMessage('Tienes nuevas citas pendientes. ¡Revisa tu agenda!');
      } else {
        setShowNotifications(true);
        // Mostrar el mensaje por defecto si no hay nuevas citas
        setNotificationMessage('No tienes nuevas citas pendientes.');
      }
    } catch (error) {
      console.error('Error al obtener las citas:', error);
    }
  };
  

  const toggleList = async () => {
    setListVisible(!isListVisible);
    setError("");
  
    try {
      const updatedAppointmentsResponse = await fetch("http://localhost:5000/Cita");
      const updatedAppointmentsData = await updatedAppointmentsResponse.json();
  
      const currentDate = new Date().toISOString().split("T")[0];
      const filteredAppointments = [];
  
      for (const appointment of updatedAppointmentsData) {
        if (appointment.fecha >= currentDate && appointment.estado === "En espera") {
          filteredAppointments.push(appointment);
        }
      }
  
      setAppointments([...filteredAppointments]);
    } catch (error) {
      console.error("Error al obtener citas actualizadas:", error);
    }
  };

  const doctorsBySpecialty = (specialty) => {
    const filteredDoctors = doctors.filter((doctor) => doctor.especialidad === specialty);
  
    console.log("Filtered Doctors:", filteredDoctors);
  
    return [
      ...filteredDoctors.map((doctor) => (
        <option key={doctor.id} value={doctor.id}>
          {doctor.nombre}
        </option>
      )),
    ];
  };
  

  const approveAppointment = async (appointmentId) => {
    try {
      setError("");

      const selectedDoctorId = selectedDoctors[appointmentId];

      if (!selectedDoctorId) {
        setError("Por favor, seleccione un médico antes de aprobar la cita.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/Cita/${appointmentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_medicoFK: parseInt(selectedDoctorId, 10),
            estado: "Activa",
          }),
        }
      );

      if (response.ok) {
        alert("La cita ha sido aprobada exitosamente.");
        toggleList();
        setSelectedDoctors((prevState) => {
          const newState = { ...prevState };
          delete newState[appointmentId];
          return newState;
        });
      } else {
        console.error("Error al asignar médico a la cita:", response.statusText);
      }
    } catch (error) {
      console.error("Error al asignar médico a la cita:", error);
    }
  };


  return (
    <div className="appointment-page">
      <div className="header">
        <div className="notifications">
          <button className="icon-button" onClick={toggleNotifications}>
            <span className="material-icons">notifications</span>
          </button>
          {showNotifications && (
            <div className="notifications-popup">
              {/* Contenido de las notificaciones */}
              <p>{notificationMessage || 'No tienes notificaciones nuevas.'}</p>
            </div>
          )}
        </div>
        <div className="logout">
          <Link className="icon-button" to="/">
            Cerrar Sesión
          </Link>
        </div>
      </div>
      <div className="welcome">
        <h1>Bienvenido Empleado</h1>
        <p>
          Este al tanto de las nuevas citas agendadas te invitamos a revisar las
          citas pendientes por aprobar
        </p>
        <button id="scheduleButton" onClick={toggleList}>
          Ver citas
        </button>
      </div>
      {isListVisible && (
        <div className="appointments-list">
          <h2 className="titulo">Citas Agendadas</h2>
          {appointments.map((appointment) => (
            <div key={appointment.id} className="appointment-item">
              <div>Fecha: {appointment.fecha}</div>
              <div>Hora: {appointment.hora}</div>
              <div>Número autorización: {appointment.idAutorizacionFK}</div>
              <div>Espeialidad: {appointment.tipoCita}</div>
              <div>
                <label htmlFor={`doctor-select-${appointment.id}`}>
                  Asignar Médico:
                </label>
                <select
                    id={`doctor-select-${appointment.id}`}
                    value={selectedDoctors[appointment.id] || ''}
                    onChange={(e) => {
                        setSelectedDoctors({
                            ...selectedDoctors,
                            [appointment.id]: e.target.value
                        });
                    }}>
                    <option value="">Seleccionar Médico</option>
                    {doctorsBySpecialty(appointment.tipoCita)}
                </select>
              </div>
              {error && <p className="text-danger">{error}</p>}
              <button onClick={() => approveAppointment(appointment.id)}>
                Aprobar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardIPS;
