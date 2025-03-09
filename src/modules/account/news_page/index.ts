import React from 'react';
const ViewPost = React.lazy(() => import('./views/ViewPost'));
const PostDetail = React.lazy(() => import('./views/PostDetail'));
const ViewPostByCategory = React.lazy(
    () => import('./views/ViewPostByCategory')
);

export { ViewPost, PostDetail, ViewPostByCategory };
