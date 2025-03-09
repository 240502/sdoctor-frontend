import React from 'react';
// import ViewClinic from './views/ViewClinic';
// import ViewClinicDetail from './views/ViewClinicDetail';
const ViewClinic = React.lazy(() => import('./views/ViewClinic'));
const ViewClinicDetail = React.lazy(() => import('./views/ViewClinicDetail'));
export { ViewClinic, ViewClinicDetail };
