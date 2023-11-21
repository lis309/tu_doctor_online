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
    const userId = localStorage.getItem('userId');
    
    useEffect(() => {
        // Obtener todas las citas
        const fetchAppointments = async () => {
            try {
                const response = await fetch("http://localhost:5000/Cita");
                const appointmentsData = await response.json();
    
                if (response.ok) {
                    setAppointments(appointmentsData);
    
                    // Filtrar citas con estado 'Activa' y del paciente actual
                    const activePatientAppointments = appointmentsData.filter(appointment => (
                        appointment.estado === 'Activa' && appointment.id_pacienteFK === parseInt(userId)
                    ));
    
                    const newNotifications = activePatientAppointments.map(appointment => ({
                        id: appointment.id,
                        message: `Tu cita de ${appointment.tipoCita} fue aprobada, nos vemos pronto el día ${appointment.fecha}!!`
                    }));
    
                    // Almacenar las notificaciones en el estado y localStorage
                    setNotifications([...notifications, ...newNotifications]);
                    localStorage.setItem('lastNotification', JSON.stringify(newNotifications[0]));
    
                    // Mostrar las notificaciones
                    setShowNotifications(true);
    
                    // Limpiar la variable después de un tiempo
                    setTimeout(() => {
                        setNotifications([]);
                        setShowNotifications(false);
                        localStorage.removeItem('lastNotification');
                    }, 5000);
                } else {
                    console.error('Error al obtener las citas:', appointmentsData.message || 'Error desconocido');
                }
            } catch (error) {
                console.error('Error en la llamada a la API:', error);
            }
        };
    
        // Recuperar la última notificación almacenada en localStorage
        const lastNotificationString = localStorage.getItem('lastNotification');
        console.log('lastNotificationString:', lastNotificationString); // Agrega este registro
    
        // Verificar si lastNotificationString no es undefined y no es null antes de intentar parsearlo
        if (lastNotificationString !== undefined && lastNotificationString !== null) {
            const lastNotification = JSON.parse(lastNotificationString);
            
            // Si hay una última notificación, mostrarla al cargar la página
            setNotifications([lastNotification]);
            setShowNotifications(true);
        }
    
        fetchAppointments();
    }, [userId, notifications]);
    

    const toggleNotifications = () => {
        // Filtrar citas con estado 'Activa' y del paciente actual
        const activePatientAppointments = appointments.filter(appointment => (
            appointment.estado === 'Activa' && appointment.id_pacienteFK === parseInt(userId)
        ));

        const newNotifications = activePatientAppointments.map(appointment => ({
            id: appointment.id,
            message: `Tu cita de ${appointment.tipoCita} fue aprobada, nos vemos pronto el día ${appointment.fecha}!!`
        }));

        // Almacenar las notificaciones en el estado y localStorage
        setNotifications([...notifications, ...newNotifications]);
        localStorage.setItem('lastNotification', JSON.stringify(newNotifications[0]));

        // Mostrar las notificaciones
        setShowNotifications(true);

        // Limpiar la variable después de un tiempo
        setTimeout(() => {
            setNotifications([]);
            setShowNotifications(false);
            localStorage.removeItem('lastNotification');
        }, 5000);
    };
    

    const toggleForm = () => {
        setFormVisible(!isFormVisible);
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
                // Obtener las especialidades de los médicos disponibles
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
        const currentDate = new Date(); // Obtener la fecha actual

        // Convertir la fecha seleccionada a un objeto de fecha
        const selectedDateObj = new Date(selectedDate);

        // Verificar si la fecha seleccionada es anterior a la actual
        if (selectedDateObj < currentDate) {
            // Mostrar un mensaje de error (puedes ajustar esto según tus necesidades)
            setError('No puedes seleccionar fechas anteriores a la actual.');

            // Deshabilitar la selección de hora
            setIsSlotAvailable(false);
        } else {
            // Limpiar el mensaje de error si la fecha es válida
            setError('');

            // Habilitar todas las horas si la fecha es válida
            setIsSlotAvailable(true);
        }

        // Actualizar la fecha seleccionada
        setSelectedDate(selectedDate);
    };

    const handleSlotSelect = (selectedSlot) => {
        // Desmarcar la selección previa si existe
        setSelectedSlot((prevSelectedSlot) => (prevSelectedSlot === selectedSlot ? '' : selectedSlot));
        // Establecer el formulario como inválido hasta que se haga clic en "Agendar Cita"
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

        // Limpiar errores al intentar enviar el formulario
        setError('');

        // Validar que se haya seleccionado una hora, una fecha, una autorización y una especialidad
        if (selectedSlot && selectedDate && authNum && selectedSpecialty) {
            const isAuthorized = await validateAuthorization();
            const userId = localStorage.getItem('userId');

            // Validar la autorización
            if (isAuthorized) {
                // Construir el objeto de cita
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
                    // Realizar la llamada a la API para registrar la nueva cita
                    const response = await fetch('http://localhost:5000/Cita', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newAppointment),
                    });

                    if (response.ok) {
                        // Obtener el ID de la cita registrada
                        const responseData = await response.json();

                        // Actualizar las citas registradas después de agendar la nueva cita
                        const updatedSlots = [...availableSlots, `${selectedDate} ${selectedSlot}`];
                        setAvailableSlots(updatedSlots);

                        // Limpiar la selección actual para permitir la selección de otra hora
                        setSelectedSlot('');

                        // Limpiar el número de autorización y la especialidad
                        setAuthNum('');
                        setSelectedSpecialty('');

                        // Limpiar la fecha seleccionada
                        setSelectedDate('');

                        // Habilitar la opción para seleccionar otra hora después de agendar
                        setIsSlotAvailable(true);

                        // Establecer el formulario como válido y sin errores
                        setIsFormValid(true);

                        // Mostrar mensaje de notificación adicional si la cita está aprobada
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
            // Establecer el formulario como inválido
            setIsFormValid(false);
        }
    };

    useEffect(() => {
        // Cuando el componente se monta, realiza la llamada a la API
        fetchBookedSlots();
        fetchSpecialties();
    }, []);

    // Función para obtener todas las horas disponibles
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
                                // Mostrar notificaciones individuales
                                notifications.map((notification) => (
                                    <p key={notification.id}>{notification.message}</p>
                                ))
                            ) : (
                                // Mostrar mensaje predeterminado si no hay notificaciones
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
        </div>
    );
};

export default Dashboard;
