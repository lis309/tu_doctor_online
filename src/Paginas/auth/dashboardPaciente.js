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
    const [notificationMessage, setNotificationMessage] = useState('');
    // Estado para almacenar temporalmente el ID de la cita
    const [temporaryAppointmentId, setTemporaryAppointmentId] = useState(null);

    console.log(temporaryAppointmentId);
    // Función para mostrar notificaciones
    const toggleNotifications = async () => {
        try {

            if (temporaryAppointmentId) {
                const response = await fetch(`http://localhost:5000/Cita/${temporaryAppointmentId}`);
                const data = await response.json();
                
                console.log(data);

                if (response.ok) {
                    const appointmentStatus = data.estado;
                    
                    // Mostrar notificaciones
                    setShowNotifications(true);

                    // Verificar si el estado de la cita es "Activa"
                    if (appointmentStatus === 'Activa') {
                        // Mostrar el mensaje de notificación adicional
                        setNotificationMessage('Tu cita fue aprobada, nos vemos pronto!!');
                        // Limpiar la variable después de aprobar la cita
                    }
                }
            } else {
                // Mostrar notificaciones
                setShowNotifications(true);
                setNotificationMessage('No tienes notificaciones nuevas.');
            }

            // Limpiar la variable después de un tiempo (puedes ajustar el tiempo según tus necesidades)
            setTimeout(() => {
                setNotificationMessage(''); // Limpiar el mensaje después de 5 segundos
                setShowNotifications(false);
            }, 5000); // Por ejemplo, limpiar después de 5 segundos
        } catch (error) {
            console.error('Error en la llamada a la API:', error);
        }
    };



    const toggleForm = () => {
        setFormVisible(!isFormVisible);
        // Limpiar errores al mostrar u ocultar el formulario
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

            // Validar la autorización
            if (isAuthorized) {
                // Construir el objeto de cita
                const newAppointment = {
                    fecha: selectedDate,
                    hora: selectedSlot,
                    idAutorizacionFK: parseInt(authNum, 10),
                    tipoCita: selectedSpecialty,
                    id_pacienteFK: 0,
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
                        const newAppointmentId = responseData.id;

                        // Almacenar temporalmente el ID de la nueva cita
                        setTemporaryAppointmentId(newAppointmentId);
                        
                        console.log(temporaryAppointmentId);

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
                            {/* Contenido de las notificaciones */}
                            <p>{notificationMessage}</p>
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
