import React from 'react';
const DoctorManagement = React.lazy(() => import('./views/DoctorManagement'));
const AddDoctor = React.lazy(() => import('./components/AddDoctor'));
export { DoctorManagement, AddDoctor };
