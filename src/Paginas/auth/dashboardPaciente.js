import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../css/estilos.css';

const Dashboard = () => {
    const [isFormVisible, setFormVisible] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [authNum, setAuthNum] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [specialties, setSpecialties] = useState([]);
    const [isSlotAvailable, setIsSlotAvailable] = useState(true);
    const [, setIsFormValid] = useState(false);
    const [error, setError] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [userAppointments, setUserAppointments] = useState([]);
    const [userId] = useState(localStorage.getItem('userId'));
    const [isViewingAppointments, setIsViewingAppointments] = useState(false);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch("http://localhost:5000/Cita");
                const appointmentsData = await response.json();

                if (response.ok) {
                    if (!appointmentsData || appointmentsData.length === 0) {
                        console.log('No hay citas disponibles.');
                    } else {
                        setAppointments(appointmentsData);

                        setShowNotifications(false);

                        const activePatientAppointments = appointmentsData.filter(appointment => (
                            appointment.estado === 'Activa' && appointment.id_pacienteFK === parseInt(userId)
                        ));

                        const newNotifications = activePatientAppointments.map(appointment => ({
                            id: appointment.id,
                            message: `Tu cita de ${appointment.tipoCita} fue aprobada, nos vemos pronto el día ${appointment.fecha}!!`
                        }));

                        setNotifications(prevNotifications => [...prevNotifications, ...newNotifications]);
                        const lastNotificationString = JSON.stringify(newNotifications[0]);
                        localStorage.setItem('lastNotification', lastNotificationString);

                        setShowNotifications(false);

                        setTimeout(() => {
                            setNotifications([]);
                            setShowNotifications(false);
                            localStorage.removeItem('lastNotification');
                        }, 5000);
                    }
                } else {
                    console.error('Error al obtener las citas:', appointmentsData.message || 'Error desconocido');
                }
            } catch (error) {
                console.error('Error en la llamada a la API:', error);
            }
        };

        const lastNotificationString = localStorage.getItem('lastNotification');
        console.log('lastNotificationString:', lastNotificationString);

        if (lastNotificationString && lastNotificationString !== 'undefined') {
            const lastNotification = JSON.parse(lastNotificationString);
            setNotifications([lastNotification]);
            setShowNotifications(true);
        }

        fetchAppointments();
    }, [userId]);

    const toggleNotifications = () => {
        const activePatientAppointments = appointments.filter(appointment => (
            appointment.estado === 'Activa' && appointment.id_pacienteFK === parseInt(userId)
        ));

        const newNotifications = activePatientAppointments.map(appointment => ({
            id: appointment.id,
            message: `Tu cita de ${appointment.tipoCita} fue aprobada, nos vemos pronto el día ${appointment.fecha}!!`
        }));

        const newNotification = newNotifications[newNotifications.length - 1];

        if (newNotification) {
            setNotifications([newNotification]);
            localStorage.setItem('lastNotification', JSON.stringify(newNotification));
            setShowNotifications(!showNotifications);

            if (showNotifications) {
                setTimeout(() => {
                    setNotifications([]);
                    setShowNotifications(false);
                    localStorage.removeItem('lastNotification');
                }, 5000);
            }
        }
    };

    const toggleForm = () => {
        setFormVisible(!isFormVisible);
        setIsViewingAppointments(false); // Agregar esta línea para ocultar la lista al mostrar el formulario
        setError('');
    };

    const fetchBookedSlots = async () => {
        try {
            const response = await fetch('http://localhost:5000/Cita');
            const data = await response.json();

            if (Array.isArray(data)) {
                const bookedSlots = data.map(slot => `${slot.fecha} ${slot.hora}`);
                setAvailableSlots(bookedSlots);
            } else {
                console.log('La respuesta de la API no es un array de citas registradas.');
            }
        } catch (error) {
            console.log('Error al obtener las citas registradas:', error);
        }
    };

    const fetchSpecialties = async () => {
        try {
            const response = await fetch('http://localhost:5000/Medico');
            const data = await response.json();

            if (Array.isArray(data)) {
                const uniqueSpecialties = Array.from(new Set(data.map(medico => medico.especialidad)));
                setSpecialties(uniqueSpecialties);
            } else {
                console.log('La respuesta de la API de Médicos no es un array.');
            }
        } catch (error) {
            console.log('Error al obtener las especialidades de los médicos:', error);
        }
    };

    const validateAuthorization = async () => {
        try {
            const response = await fetch(`http://localhost:5000/Autorizacion?numero_Autorizacion=${authNum}`);
            const data = await response.json();

            return Array.isArray(data) && data.length > 0;
        } catch (error) {
            console.log('Error al validar la autorización:', error);
            return false;
        }
    };

    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        const currentDate = new Date();

        const selectedDateObj = new Date(selectedDate);

        if (selectedDateObj < currentDate) {
            setError('No puedes seleccionar fechas anteriores a la actual.');
            setIsSlotAvailable(false);
        } else {
            setError('');
            setIsSlotAvailable(true);
        }

        setSelectedDate(selectedDate);
    };

    const fetchUserAppointments = async () => {
        try {
            const response = await fetch(`http://localhost:5000/Cita?id_pacienteFK=${userId}`);
            const data = await response.json();
    
            if (response.ok) {
                setUserAppointments(data);
            } else {
                console.error('Error al obtener las citas del paciente:', data.message || 'Error desconocido');
            }
        } catch (error) {
            console.error('Error en la llamada a la API:', error);
        }
    };    

    const handleSlotSelect = (selectedSlot) => {
        setSelectedSlot((prevSelectedSlot) => (prevSelectedSlot === selectedSlot ? '' : selectedSlot));
        setIsFormValid(false);
    };

    const handleAuthNumChange = (event) => {
        const authNumValue = event.target.value;
        setAuthNum(authNumValue);
    };

    const handleSpecialtyChange = (event) => {
        const selectedSpecialty = event.target.value;
        setSelectedSpecialty(selectedSpecialty);
    };

    const handleAppointmentSubmit = async (event) => {
        event.preventDefault();

        setError('');

        if (selectedSlot && selectedDate && authNum && selectedSpecialty) {
            const isAuthorized = await validateAuthorization();

            if (isAuthorized) {
                const newAppointment = {
                    fecha: selectedDate,
                    hora: selectedSlot,
                    idAutorizacionFK: parseInt(authNum, 10),
                    tipoCita: selectedSpecialty,
                    id_pacienteFK: parseInt(userId),
                    id_medicoFK: 0,
                    estado: "En espera"
                };

                try {
                    const response = await fetch('http://localhost:5000/Cita', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newAppointment),
                    });

                    if (response.ok) {
                        const responseData = await response.json();

                        const updatedSlots = [...availableSlots, `${selectedDate} ${selectedSlot}`];
                        setAvailableSlots(updatedSlots);

                        setSelectedSlot('');
                        setAuthNum('');
                        setSelectedSpecialty('');
                        setSelectedDate('');
                        setIsSlotAvailable(true);
                        setIsFormValid(true);

                        if (responseData.estado === 'Activa') {
                            alert('Cita registrada con éxito y aprobada. ¡Nos vemos pronto!');
                        } else {
                            alert('Cita registrada con éxito. Esperando aprobación.');
                        }
                    } else {
                        console.error('Error al intentar registrar la cita:', response.status, response.statusText);
                        setError('Error al intentar agendar la cita. Por favor, inténtelo de nuevo.');
                    }
                } catch (error) {
                    console.error('Error en la llamada a la API:', error);
                    setError('Error al intentar agendar la cita. Por favor, inténtelo de nuevo.');
                }
            } else {
                setError('Número de autorización no válido');
            }
        } else {
            setError('Por favor, complete todos los campos del formulario');
            setIsFormValid(false);
        }
    };

    useEffect(() => {
        fetchBookedSlots();
        fetchSpecialties();
    }, []);

    const getAllSlots = () => {
        const startTime = new Date('2023-11-11T06:00:00');
        const endTime = new Date('2023-11-11T18:00:00');
        const timeSlots = [];

        let currentTime = startTime;

        while (currentTime < endTime) {
            const timeString = currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
            timeSlots.push(timeString);
            currentTime.setMinutes(currentTime.getMinutes() + 30);
        }

        return timeSlots;
    };

    const toggleViewAppointments = () => {
        setIsViewingAppointments(!isViewingAppointments);
        setFormVisible(false); // Agregar esta línea para ocultar el formulario al mostrar la lista

        if (!isViewingAppointments) {
            fetchUserAppointments();
        }
    };

    return (
        <div className="container">
            <div className="header">
                <div className="notifications">
                    <button className="icon-button" onClick={toggleNotifications}>
                        <span className="material-icons">notifications</span>
                    </button>
                    {showNotifications && (
                        <div className="notifications-popup">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <p key={notification.id}>{notification.message}</p>
                                ))
                            ) : (
                                <p>No tienes notificaciones nuevas.</p>
                            )}
                        </div>
                    )}
                </div>
                <div className="logout">
                    <Link className="icon-button" to="/">Cerrar Sesión</Link>
                </div>
            </div>
            <div className="welcome-section">
                <h1>
                    Bienvenido Paciente
                </h1>
                <p>
                    En la IPS Salud para Todos, nos comprometemos a brindarle el mejor servicio y atención médica. Nuestro equipo altamente calificado está aquí para cuidar de su salud y garantizar una experiencia positiva, lo invitamos agendar su cita de manera rápida y en cuestión de segundos.
                </p>
                <button id="scheduleButton" onClick={toggleForm}>
                    Agendar Cita
                </button>
                <button id="viewAppointmentsButton" onClick={toggleViewAppointments}>
                    Ver Citas Agendadas
                </button>
            </div>
            {isFormVisible && (
                <div className="form-section">
                    <form onSubmit={handleAppointmentSubmit}>
                        <label htmlFor="fecha">Seleccionar fecha:</label>
                        <input
                            type="date"
                            id="fecha"
                            name="fecha"
                            onChange={handleDateChange}
                            value={selectedDate}
                        />
                        <label>Seleccionar hora:</label>
                        <div className="time-slots">
                            {getAllSlots().map((option, index) => (
                                <input
                                    key={index}
                                    type="button"
                                    onClick={() => handleSlotSelect(option)}
                                    disabled={!isSlotAvailable || availableSlots.includes(`${selectedDate} ${option}`)}
                                    className={selectedSlot === option ? 'selected' : ''}
                                    value={option}
                                />
                            ))}
                        </div>
                        <label htmlFor="authNum">Número de Autorización:</label>
                        <input
                            type="number"
                            id="authNum"
                            name="authNum"
                            placeholder="Ingresa tu número de autorización"
                            onChange={handleAuthNumChange}
                            value={authNum}
                        />
                        <label htmlFor="specialty">Seleccionar Especialidad:</label>
                        <select
                            id="specialty"
                            name="specialty"
                            onChange={handleSpecialtyChange}
                            value={selectedSpecialty}
                        >
                            <option value="" disabled>Selecciona una especialidad</option>
                            {specialties.map((specialty, index) => (
                                <option key={index} value={specialty}>{specialty}</option>
                            ))}
                        </select>
                        {error && <p className="text-danger">{error}</p>}

                        <button type="submit">
                            Agendar Cita
                        </button>
                    </form>
                </div>
            )}
            {isViewingAppointments && (
                <div className="appointments-list-citas">
                    <h2>Citas Agendadas</h2>
                    {userAppointments.length > 0 ? (
                        <ul>
                            {userAppointments.map(appointment => (
                                <li key={appointment.id}>
                                    <strong>Fecha:</strong> {appointment.fecha} | <strong>Hora:</strong> {appointment.hora} | <strong>Especialidad:</strong> {appointment.tipoCita}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No tienes citas agendadas.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
