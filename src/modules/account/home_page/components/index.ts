import React from 'react';
const BlockSpecialization = React.lazy(() => import('./BlockSpecialization'));
const BlockClinic = React.lazy(() => import('./BlockClinic'));
const BlockCommonPost = React.lazy(() => import('./BlockCommonNews'));
const BlockSearchDoctor = React.lazy(() => import('./BlockSearchDoctor'));
export * from './NextArrow';
export * from './PrevArrow';

export { BlockSpecialization, BlockClinic, BlockCommonPost, BlockSearchDoctor };
