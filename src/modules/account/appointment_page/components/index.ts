import React from 'react';

const BlockCalendar = React.lazy(() => import('./BlockCalendar'));
const InputAppointmentModal = React.lazy(
    () => import('./InputAppointmentModal')
);
const SchedulesComp = React.lazy(() => import('./SchedulesComp'));

export { BlockCalendar, InputAppointmentModal, SchedulesComp };
