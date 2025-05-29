import React from 'react'; 
import {Navigate} from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    } catch (err) {
        false;
    }
}

const PrivateRoute = ({ children }) => {
    return isTokenValid() ? children : <Navigate to="/login"/>;
};

export default PrivateRoute;