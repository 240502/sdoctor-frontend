import React from 'react';

const ViewDoctor = React.lazy(() => import('./views/ViewDoctor'));
const ViewDetailDoctor = React.lazy(() => import('./views/ViewDetailDoctor'));
// import ViewDoctor from './views/ViewDoctor';
// import ViewDetailDoctor from './views/ViewDetailDoctor';
export { ViewDoctor, ViewDetailDoctor };
