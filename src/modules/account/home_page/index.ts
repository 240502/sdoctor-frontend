import React from 'react';
// import Home from './views/Home';
const Home = React.lazy(() => import('./views/Home'));
export { Home };
