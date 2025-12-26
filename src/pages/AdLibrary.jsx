import React, { useState, useEffect } from 'react';
import { getData } from '../services/metaService';

function AdLibrary() {

    // Initialize Facebook SDK
    useEffect(() => {
        // Check if SDK is already loaded
        console.log('inside useEffect')
        fetchData()
        console.log('inside data fetched')

    }, []);

    const fetchData = () => {
        getData().then((data) => {
            console.log(data);
        }).catch((error) => {
            console.error(error);
        });
    }

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <h2 className='text-7xl'>Ad Campaigns</h2>
        </div>
    );
}

export default AdLibrary;