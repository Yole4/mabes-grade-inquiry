import React, { useEffect, useState } from 'react'
import '../assets/css/Style.css';
import logo from '../assets/images/logo.png';
import BackendURL from '../backend URL/BackendURL';
import axios from 'axios';

import { FaUserAlt, FaEyeSlash, FaEye, FaUserShield, FaKey } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate();
    //backend URL
    const backendUrl = BackendURL();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isFaSlash, setIsFaSlash] = useState(false);

    // responses
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    // ###############################  LOGIN REQUEST ###################################
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const loginRequest = { username, password };
        try {
            const response = await axios.post(`${backendUrl}/api/login`, loginRequest);
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                setIsLoading(false);

                setErrorMessage("Login Success!");
                setIsSuccess(true);

                setTimeout(() => {
                    setIsSuccess(false);
                }, 5000);

                localStorage.setItem('token', response.data.message);

                if (response.data.userType === "Admin") {
                    navigate('/admin');
                }
                else if (response.data.userType === "Student") {
                    navigate('/student');
                }
                else if (response.data.userType === "Staff") {
                    navigate('/staff');
                }
                else {
                    navigate('/');
                }
            }
        } catch (error) {
            setIsLoading(false);
            if (error.response && error.response.status === 401) {
                setErrorMessage(error.response.data.message);
                setIsError(true);

                setTimeout(() => {
                    setIsError(false);
                }, 5000);
            } else {
                console.log('Error: ', error);
            }
        }
    }

    return (
        <div className='container'>
            <div className="login-body">
                <div style={{ textAlign: 'center' }}>
                    <img src={logo} height={150} width={150} alt="" />
                </div>
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <h2> MABES GRADE INQUIRY</h2>
                </div>
                <div style={{ display: isError ? 'block' : 'none', backgroundColor: '#fb7d60', borderRadius: '5px', fontSize: '15px', textAlign: 'center', padding: '10px', color: 'white' }}>
                    <span>{errorMessage}</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='form-control'>
                        <span>Username/LRN</span>
                        <div className='input-body'>
                            <input className='form-input' value={username} onChange={(e) => setUsername(e.target.value)} style={{ paddingLeft: '40px' }} type="text" placeholder='Username/LRN' />
                            <FaUserAlt className='icon' size={19} />
                        </div>
                    </div>

                    <div className='form-control'>
                        <span>Password</span>
                        <div className='input-body'>
                            <input className='form-input' value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingLeft: '40px' }} type={isFaSlash ? 'text' : 'password'} placeholder='***********' />
                            <FaKey className='icon' size={19} />
                            {isFaSlash ? (
                                <FaEye onClick={() => setIsFaSlash(false)} className='icon eye' size={23} />
                            ) : (
                                <FaEyeSlash onClick={() => setIsFaSlash(true)} className='icon eye' size={23} />
                            )}
                        </div>
                    </div>
                    <div className="form-control" style={{ display: 'flex' }}>
                        <input className='checkbox' type="checkbox" id='check' /><label className='checkbox-label' htmlFor='check'> Remember Me</label>
                    </div>

                    <div className="form-control">
                        <button type='submit' className='form-input'>Login</button>
                    </div>
                    <div className="form-control" style={{ textAlign: 'center', color: 'red' }}>
                        <span style={{ color: 'red', cursor: 'pointer' }}>Forgot Password?</span>
                    </div>
                </form>
            </div>

            {/* fetching data screen */}
            <div className="popup-modal-profile" style={{ display: isLoading ? 'block' : 'none' }}>
                <div className="modal-pop-up-loading">
                    <div className="modal-pop-up-loading-spiner"></div>
                    <p>Loading...</p>
                </div>
            </div>

            {/* Loading div */}
            <div className='error-respond' style={{ display: isSuccess ? 'block' : 'none', backgroundColor: isSuccess ? '#7b4ae4' : '' }}>
                <div>
                    <h5>{errorMessage}</h5>
                </div>
            </div>
        </div>
    )
}

export default Login
