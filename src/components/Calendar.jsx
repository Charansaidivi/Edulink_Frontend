import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../data/apiData';
import Navbar from './Navbar';
import './Calendar.css'; // Import the custom CSS

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCalendarEvents = async () => {
            try {
                const token = localStorage.getItem('loginToken');
                const response = await axios.get(`${API_URL}/student/calendar-events`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Combine enrolled and teaching sessions into a single events array
                const enrolledEvents = response.data.enrolledSessions.map((session) => ({
                    title: `Enrolled: ${session.topicName}`,
                    start: `${session.startDate}T${session.startTime}`,
                    end: `${session.endDate}T${session.endTime}`,
                }));

                const teachingEvents = response.data.createdSessions.map((session) => ({
                    title: `Teaching: ${session.topicName}`,
                    start: `${session.startDate}T${session.startTime}`,
                    end: `${session.endDate}T${session.endTime}`,
                }));

                setEvents([...enrolledEvents, ...teachingEvents]);
            } catch (error) {
                console.error('Error fetching calendar events:', error);
                toast.error('Failed to load calendar events');
            } finally {
                setLoading(false);
            }
        };

        fetchCalendarEvents();
    }, []);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="loading-container">Loading...</div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="calendar-container">
                <h2>My Calendar Events</h2>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    eventClick={(info) => {
                        alert(`Event: ${info.event.title}\nStart: ${info.event.start}`);
                    }}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,dayGridWeek,dayGridDay',
                    }}
                    buttonText={{
                        today: 'Today',
                        month: 'Month',
                        week: 'Week',
                        day: 'Day',
                    }}
                    height="auto"
                />
            </div>
        </>
    );
};

export default Calendar;