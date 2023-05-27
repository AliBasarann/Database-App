import React, { useState, useEffect } from 'react';
import "./LoginPage.scss";
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { loginAudience } from '../../APIFunctions/DealApi';
function LoginPageAudience() {
    const { register, handleSubmit } = useForm();
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    useEffect(()=> {
        if (localStorage.getItem("accessToken")) {
            if (localStorage.getItem("type") == "db-manager") {
                navigate("/api/db-manager")
            }
            else if (localStorage.getItem("type") == "director") {
                navigate("/api/director")
            }
            else {
                navigate("/api/audience")
            }
        }
    }, []);
    const onSubmit = async ({ username, password }) => {
        try {
            console.log(password)

            const response = await loginAudience({username: username, password: password});
            console.log(response);
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("type", "audience")
            window.dispatchEvent(new Event('storage'))
            navigate("/api/audience")
        } catch(e) {
            if (e.response && e.response.status == 400) {
                setMessage(e.response.data.message);
            }
        }
    }
    const databaseManagerLogin = () => {
        navigate("/login")
    }
    const directorLogin = () => {
        navigate("/director-login")
    }
    useEffect(() => {
        const timer = setTimeout(() => {
          setMessage('');
        }, 3000);
    
        return () => clearTimeout(timer);
      }, [message]);
    return <div className='login-page'>
        {message && <div className="message">{message}</div>}
        <span className='login-text'>
            Please write your username and password
        </span>
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                type="text"
                id="username"
                label="username"
                {...register("username" , {required: true})}
            />
            <TextField
                type="password"
                id="password"
                label="Password"
                {...register("password", {required: true})}
            />
            <Button size="large" type='submit' variant="contained" color="primary">
                Enter
            </Button>
        </form>
            <br/>
            <Button size="large" type='submit' variant="contained" color="secondary" onClick= {databaseManagerLogin}>
                Database Manager Login
            </Button>
            <Button size="large" type='submit' variant="contained" color="secondary" onClick= {directorLogin}>
                Director Login
            </Button>
    </div>;
}

export default LoginPageAudience;