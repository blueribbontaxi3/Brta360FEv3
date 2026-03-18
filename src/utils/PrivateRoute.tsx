import React from 'react';
import { Route } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../utils/helper';
import Redirect from '../routing/redirect';

const PrivateRoute = (props: any) => {
    const { component: Component, ...rest } = props;

    const render = (props: any) => {
        if (!getCurrentUser()) {
            return <Route path="/" element={<Redirect to="/login" />} />
        }
        return <Component {...props} />;
    };

    return <Route {...rest} render={render} />;
}

export default PrivateRoute;