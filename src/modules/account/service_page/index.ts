import React from 'react';
const ViewMedicalPackages = React.lazy(
    () => import('./views/ViewMedicalPackages')
);
// import ViewService from './views/ViewService';
// import ViewDetailService from './views/ViewDetailService';
export default ViewMedicalPackages;
