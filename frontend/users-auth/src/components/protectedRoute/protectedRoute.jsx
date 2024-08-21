import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isUserSignedIn = !!localStorage.getItem('token');

    if (!isUserSignedIn) {
        // If the user is not signed in, redirect to the login page
        return <Navigate to="/" />;
    }

    // If the user is signed in, allow access to the route
    return children;
};

export default ProtectedRoute;
