import React, { useState } from "react";
import { Button } from '@material-ui/core';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

import logo from "../../assets/logo.svg";
import LoginForm from './loginForm/LoginForm';
import RegisterForm from './registerForm/RegisterForm';
import './Header.css';

const modalStyle = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

export default function () {
    const [userLoggedIn, setUserLoggedIn] = useState(window.sessionStorage.getItem('access-token') !== null);
    const deactivateModal = () => updateLoginModal(false);
    const activateModal = () => updateLoginModal(true);

    const [loginModal, updateLoginModal] = useState(false);
    const [activePage, setActivePage] = useState('LOGIN');
    const [successMessage, setSuccessMessage] = useState('');

    const handleLogout = async () => {
        try {
            const rawData = await fetch('/api/v1/auth/logout', {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${window.sessionStorage.getItem('access-token')}`
                },
            });

            if (rawData.status === 200) {
                window.sessionStorage.removeItem('user-details');
                window.sessionStorage.removeItem('access-token');
                setUserLoggedIn(false);
            } else {
                alert('Something went wrong.. Please try again later...');
            }
        } catch (error) {
            console.error({ error: error.message });
            alert('Something went wrong.. Please try again later...');
        }
    }

    let activePageJS;
    if (activePage === 'LOGIN') {
        activePageJS = React.createElement(LoginForm, { setUserLoggedIn, updateLoginModal, activePage, setActivePage, setSuccessMessage, deactivateModal });
    } else if (activePage === 'REGISTER') {
        activePageJS = React.createElement(RegisterForm, { activePage, setActivePage, setSuccessMessage, successMessage, deactivateModal })
    }

    let loginLogoutBtn = React.createElement(Button, { variant: "contained", onClick: activateModal }, 'Login');
    if (userLoggedIn) {
        loginLogoutBtn = React.createElement(Button, { variant: "contained", onClick: handleLogout }, 'Logout');
    }

    let bookShowBtn = '';
    if (window.location.pathname.startsWith('/movie/')) {
        if (!sessionStorage.getItem("access-token"))
            bookShowBtn = <Button variant="contained" color="primary" onClick={activateModal}>Book Show</Button>;
        else
            bookShowBtn = <Button variant="contained" color="primary" href={`/bookshow/${window.location.pathname.split('/movie/')[1]}`}>Book Show</Button>
    }

    return (
        <div>
            <div className="header">
                <Link to={`/`}>
                    <img src={logo} className="logo" alt="LOGO" />
                </Link>
                <div className="nav-buttons">
                    {bookShowBtn}
                    {loginLogoutBtn}
                </div>
            </div>
            <Modal
                style={modalStyle}
                isOpen={loginModal}
                ariaHideApp={false}
                appElement={document.getElementById('modal')}
            >
                {activePageJS}
            </Modal>
        </div>
    )
};
