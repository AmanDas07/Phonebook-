import React, { useContext, useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../context/page';
import { NavLink, useNavigate } from 'react-router-dom';

const Register = () => {

    const [username, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [state, setState] = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const Router = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const response = await axios.post('http://localhost:3001/user/register', { username: username, email: email, password: password });
            console.log(response);
            toast.success(response.data.message);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.status === 409) {
                toast.error(err.response.data.message);
            } else {
                toast.error('An error occurred. Please try again.');
            }
        }

    };

    if (state && state.token) {
        Router("/");
    }
    return (
        <div className='container'>
            <div className='row d-flex justify-content-center align-items-center '>
                <div className='col-md-8' />
                <h1 className='d-flex align-items-center justify-content-center mt-3 mb-3' style={{ fontSize: '2rem', color: '#fff', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>Register</h1>
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
                    <div className="mb-3">
                        <label htmlFor="exampleInputName" className="form-label">Name</label>
                        <input type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp" value={username} onChange={(event) => { setName(event.target.value) }
                        } />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={(event) => { setEmail(event.target.value) }
                        } />

                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={(event) => { setPassword(event.target.value) }
                        } />
                    </div>

                    <div className='d-flex '>
                        <button type="submit" className="btn btn-primary " onClick={handleSubmit} disabled={!username || !password || !email}>{
                            loading ? (<>
                                <span>Loading &nbsp;</span>
                                <span className='spinner-border spinner-border-sm' role='status' area-hidden='true'></span>
                            </>) : ('Register')
                        }</button>
                        <p className='m-3'>Already Registered ?  <NavLink to="/login">Click here...</NavLink></p>
                    </div>

                </form>
            </div>
        </div>


    )
}

export default Register;

/*   const handleSubmit = async (e) => {
       e.preventDefault();
       try {
           const response = await axios.post('http://localhost:3001/user/register', { email, password });
           console.log(response.data);
       } catch (error) {
           console.error(error);
       }
   };

   return (
       <form onSubmit={handleSubmit}>
           <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
           <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
           <button type="submit">Register</button>
       </form>
   );
}

export default Register;*/
