// src/components/Login.js
import React, { useEffect, useState, useContext } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../context/page';
import { NavLink, useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [state, setState] = useContext(UserContext);
    const navigate = useNavigate();
    async function handleSubmit(event) {
        event.preventDefault();

        const response = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            setState({
                user: data.user,
                token: data.access_token
            })
            window.localStorage.setItem("auth", JSON.stringify(data));
            toast.success("User Logged in Successfully");
            navigate("/contacts")
            setLoading(false);
        } else {
            toast.error('Login failed!');
        }
    }


    return (
        <div className='container col-md-4 '>
            <div className='row d-flex justify-content-center align-items-center '>
                <div className='col-md-8' />
                <h1 className='d-flex align-items-center justify-content-center mt-3 mb-3' style={{ fontSize: '2rem', color: '#fff', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Login</h1>
                <form className='shadow-lg p-3 mb-5 bg-white rounded' >
                    <ToastContainer position="top-center"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                    <div className="mb-3 col-md-15">
                        <label htmlFor="exampleInputEmail" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={(event) => { setEmail(event.target.value) }
                        } />
                    </div>
                    <div className="mb-3 col-md-15">
                        <label htmlFor="exampleInputPassword" className="form-label">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={(event) => { setPassword(event.target.value) }
                        } />
                    </div>
                    <div className='d-flex '>
                        <button type="submit" className="btn btn-primary bg-dark " onClick={handleSubmit} disabled={!password || !email}>{
                            loading ? (<>
                                <span>Loading &nbsp;</span>
                                <span className='spinner-border spinner-border-sm' role='status' area-hidden='true'></span>
                            </>) : ('Login')
                        }</button>
                        <p className='m-3'>New User ?  <NavLink to="/Register">Click here...</NavLink></p>

                    </div>


                </form>
            </div>
        </div>



    )


}

export default Login;