import React, { useState } from 'react';
import "./LoginPage.scss";
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function LoginPageAudience() {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const onSubmit = ({ email, password }) => {
        localStorage.setItem("email", email)
        localStorage.setItem("password", password)
        window.dispatchEvent(new Event('storage'))
        navigate("/api")
    }
    const databaseManagerLogin = () => {
        navigate("/login")
    }
    const directorLogin = () => {
        navigate("/director-login")
    }

    return <div className='login-page'>
        <span className='login-text'>
            Please write your email and password
        </span>
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                type="email"
                id="email"
                label="E-mail"
                {...register("email" , {required: true})}
            />
            <TextField
                type="password"
                id="password"
                label="Password"
                {...register("Password", {required: true})}
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