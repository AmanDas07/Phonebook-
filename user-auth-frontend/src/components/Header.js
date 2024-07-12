import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/page';

const Header = () => {
    const [state, setState] = useContext(UserContext);
    const [currentTab, setTab] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const logoutController = () => {
        window.localStorage.removeItem("auth");
        window.localStorage.removeItem('record');
        setState(null);
        navigate("/login");
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setTab(window.location.pathname);
        }
    }, [location]);

    useEffect(() => {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.forEach(innerLink => innerLink.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: 'gray', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div className="container">
                <NavLink className="navbar-brand" to="/">
                    <h1>User</h1>
                </NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-1">

                        {state != null ? (
                            <>
                                <button className="btn btn-secondary" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
                                    {state && state.user && state.user.username}
                                </button>

                                <li className="nav-item">
                                    <a className="nav-link" style={{ cursor: 'pointer' }} onClick={() => navigate("/contacts")}>Contacts</a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link" style={{ cursor: 'pointer' }} onClick={logoutController}>Logout</a>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/register">Register</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" aria-current="page" to="/login">Login</NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
