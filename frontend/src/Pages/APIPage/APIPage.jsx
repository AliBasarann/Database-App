import React from 'react';
import { useLoaderData } from 'react-router-dom';
import FormBuilder from '../../Components/FormBuilder/FormBuilder';
import JsonViewer from '../../Components/JSONViewer/JSONViewer';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import NavBar from '../../Components/NavBar/NavBar';
import "./APIPage.scss";
import { Divider } from '@mui/material';


function APIPage({ }) {
    const apiData = useLoaderData();
    const [message, setMessage] = useState('');

    const [json, setJson] = useState(null);
    const [refreshData, setRefreshData] = useState(false);
    useEffect(()=> {
        setJson({});
    }, [apiData]);
    const getJSONData = async () => {
        if (apiData.getFunction) {
            const response = await apiData.getFunction();
            setJson(response);
        }
    };
    const onSubmit = async (data) => {
        setJson({});
        if (apiData.postFunction) {
            try {
                const response = await apiData.postFunction(data);
                setMessage(response.data.message);
            } catch(e) {
                if (e.response) {
                    setMessage(e.response.data.message);
                }
            }
        } else if (apiData.getWithPostFunction) {
            try {
                const response = await apiData.getWithPostFunction(data);
                setJson(response);
            } catch(e) {
                console.log(e);
                if (e.response) {
                    setMessage(e.response.data.message);
                }
            }
        }
        else {
            console.log(`You tried to post but dont have a post function set, heres what you posted \n ${JSON.stringify(data)}`)
        }
    }


    useEffect(() => {
        getJSONData();
    }, [apiData, refreshData]);

    useEffect(() => {
        const timer = setTimeout(() => {
          setMessage('');
        }, 3000);
    
        return () => clearTimeout(timer);
      }, [message]);

    return <div className='apipage'>
        {message && <div className="message">{message}</div>}
        <div className='top-box'>
        
            <nav>
                <NavBar></NavBar>
            </nav>
            {["View Directors","View Director's Movies", "View Tickets"].includes(apiData.name) ?  <div></div> :
                <div>
                    <h1 className='apipage-title'>
                        {apiData.name}
                    </h1>
                    <Divider />
                    <div className='form-box'>
                        <FormBuilder inputs={apiData.form.inputs} buttonText={apiData.form.buttonText} onSubmit={onSubmit} />
                    </div>
                </div>
            }
            {apiData.dataTitle ?
                <><h2 className='apipage-title'>
                    {apiData.dataTitle}
                </h2>
                    <Divider /> </> : null
            }
        </div>
        {console.log(apiData.Name)}
        {["View Directors", "View Ratings", "View Movies", "Get Average Rating", "View Available Theatres", "View Director's Movies",
         "View Audiences", "View Tickets"].includes(apiData.name) ? 
            <div className='json-box'>
                {/*
                <div className='refresh-btn'>
                    <Button
                        variant="outlined" size="large" label="Submit" type="button"
                        onClick={() => setRefreshData(!refreshData)}
                    >
                        Refresh
                    </Button>
                </div>
                */
                }
                <JsonViewer json={json} />

            </div> 
        :<div></div>}
        
    </div>;

}

export default APIPage;