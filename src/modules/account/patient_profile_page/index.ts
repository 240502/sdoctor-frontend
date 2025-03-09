import React from 'react';

const ViewAppointment = React.lazy(() => import('./views/ViewAppointment'));
const ViewProfile = React.lazy(() => import('./views/ViewProfile'));
const ViewWatchedClinic = React.lazy(() => import('./views/ViewWatchedClinic'));
const ViewWatchedDoctor = React.lazy(() => import('./views/ViewWatchedDoctor'));
// import ViewAppointment from './views/ViewAppointment';
// import ViewProfile from './views/ViewProfile';
// import ViewWatchedClinic from './views/ViewWatchedClinic';
// import ViewWatchedDoctor from './views/ViewWatchedDoctor';
export { ViewAppointment, ViewProfile, ViewWatchedClinic, ViewWatchedDoctor };
