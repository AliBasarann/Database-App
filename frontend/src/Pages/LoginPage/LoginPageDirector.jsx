import React, { useState, useEffect } from 'react';
import "./LoginPage.scss";
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { loginDirector } from '../../APIFunctions/DealApi';
function LoginPageDirector() {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
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
            console.log(password);
            const response = await loginDirector({username: username, password: password});
            console.log(response);
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("type", "director")
            window.dispatchEvent(new Event('storage'))
            navigate("/api/director")
        } catch(e) {
            if (e.response && e.response.status == 400) {
                setMessage(e.response.data.message);
            }
        }
    }
    const databaseManagerLogin = () => {
        navigate("/login")
    }
    const audienceLogin = () => {
        navigate("/audience-login")
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
            <Button size="large" type='submit' variant="contained" color="secondary" onClick= {audienceLogin}>
                Audience Login
            </Button>
    </div>;
}

export default LoginPageDirector;