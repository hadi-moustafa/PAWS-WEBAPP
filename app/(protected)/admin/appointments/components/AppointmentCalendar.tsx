'use client'

import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Since I don't know if Button exists, I will use a standard button with neopop class if available or just inline style for now to match NeoPop style I saw in other files.

const localizer = momentLocalizer(moment)


type Appointment = {
    id: number
    date: string
    type: string
    vet?: { name: string }
    pet?: { name: string }
}

export default function AppointmentCalendar({ appointments }: { appointments: Appointment[] }) {
    const events = appointments.map(apt => ({
        start: new Date(apt.date),
        end: moment(apt.date).add(1, 'hours').toDate(), // Assuming 1 hour duration for now
        title: `${apt.type} - ${apt.pet?.name || 'Unknown Pet'} (Dr. ${apt.vet?.name || 'Unknown'})`
    }))


    return (
        <div style={{ height: '500px', background: 'white', padding: '1rem', borderRadius: '1rem', border: '2px solid black', boxShadow: '4px 4px 0px black' }}>
            <Calendar
                localizer={localizer}
                events={events} // We will hook this up to real data later
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                views={['month', 'week', 'day']}
                defaultView={Views.MONTH}
            />
        </div>
    )
}
