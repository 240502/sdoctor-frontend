import React from 'react';
const BookingAppointment = React.lazy(
    () => import('./views/BookingAppointment')
);
// import BookingAppointment from './views/BookingAppointment';
export default BookingAppointment;
