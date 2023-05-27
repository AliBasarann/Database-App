import React, { useState } from "react";
import { Outlet, redirect, useNavigate } from "react-router-dom";
import "./MainContainer.scss";
import Button from '@mui/material/Button'

function MainContainer() {
    const [logged, setLogged] = useState(!!localStorage.getItem("accessToken"));
    const navigate = useNavigate();
    const logout = async () => {
        localStorage.removeItem("accessToken");
        window.dispatchEvent(new Event('storage'))
        navigate("/login")
    }

    React.useEffect(() => {
        setLogged(localStorage.getItem("accessToken"));        
    }
    , [localStorage.getItem("accessToken")])

    return <div className="main-container">
        {logged &&
            <div className="logout-container">
                <Button onClick={logout} variant="outlined" color="error">
                    Log out
                </Button>
            </div>
        }


        <main className="center-box">
            <Outlet />
        </main>
    </div>
}

export default MainContainer;