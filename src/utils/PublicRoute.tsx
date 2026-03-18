import React from 'react';
import { Route } from 'react-router-dom';
import { isAuthenticated,getCurrentUser} from '../utils/helper';
import Redirect from '../routing/redirect';



const  PublicRoute = (props:any) =>{
    const { component: Component, restricted = false, ...rest } = props;

    const render = (props:any) => {
        if (isAuthenticated && restricted) {
            return <Route path="/" element={<Redirect to="/dashboard" />} />

        }

        return <Component {...props} />;
    };

    return <Route {...rest} render={render} />;
}

export default PublicRoute;