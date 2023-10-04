import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackendURL from '../backend URL/BackendURL';

function Test() {
    // return true;
    const backendUrl = BackendURL();

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
                    // modify this line
                }
            } catch (error) {
                // modify this line
            }
        }
        test();
    } else {
        // modify this line
    }
}

export default Test;
