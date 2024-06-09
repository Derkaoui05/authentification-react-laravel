import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ element }) => {
    const isAuthenticated = !!localStorage.getItem('token');
    return isAuthenticated ? <Navigate to="/products" /> : element;
};

export default PublicRoute;
