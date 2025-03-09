import React from 'react';
const ViewService = React.lazy(() => import('./views/ViewService'));
const ViewDetailService = React.lazy(() => import('./views/ViewDetailService'));
// import ViewService from './views/ViewService';
// import ViewDetailService from './views/ViewDetailService';
export { ViewService, ViewDetailService };
