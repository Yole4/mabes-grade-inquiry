import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackendURL from '../backend URL/BackendURL';

function Auth() {
    const backendUrl = BackendURL();
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Initialize as null

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const test = async () => {
                try {
                    const response = await axios.get(`${backendUrl}/api/protected`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.status === 200) {
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    setIsAuthenticated(false);
                }
            };

            test();
        } else {
            setIsAuthenticated(false);
        }
    }, []); 

    if (isAuthenticated === null) {
        // Return null while the asynchronous operation is in progress
        return null;
    }

    return isAuthenticated; // Return true or false once the operation is complete
}

export default Auth;
