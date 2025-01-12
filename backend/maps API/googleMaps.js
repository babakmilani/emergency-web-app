// backend/maps API/googleMaps.js

import express from 'express';
import axios from 'axios';
import dbConnection from '../database/db.js';
import dotenv from 'dotenv';

dotenv.config(); // load environment variables

const router = express.Router();

// '/data' route to fetch and geocode emergency data
router.get('/data', async (req, res) => {  
    let connection;
    try {
        const pool = await dbConnection(); // Get the pool
        connection = await pool.getConnection(); // Get a connection from the pool

        const [rows] = await connection.query(
            'SELECT agency, emergency, threat, address, state, zip FROM emergencies'
        );

        const geocodedData = await Promise.all(
            rows.map(async (row) => {
                const fullAddress = `${row.address}, ${row.state}, ${row.zip}`;
                const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${process.env.MAPS_API}`;

                const response = await axios.get(geocodeUrl);
                if (response.data.results.length > 0) {
                    const location = response.data.results[0].geometry.location;
                    return {
                        agency: row.agency,
                        emergency: row.emergency,
                        threat: row.threat,
                        address: row.address,
                        state: row.state,
                        zip: row.zip,
                        lat: location.lat,
                        lng: location.lng,
                    };
                } else {
                    console.error(`No geocode results for address: ${fullAddress}`);
                    return null;
                }
            })
        );

        const filteredData = geocodedData.filter((entry) => entry !== null);
        res.json(filteredData);
    } catch (err) {
        console.error('Error: ', err);
        
    } finally {
        if (connection) connection.release(); // Ensure the connection is released
    }
});



export default router;

/*
const loader = new google.maps.plugins.loader.Loader({
    apiKey: process.env.MAPS_API,  // Your API key
    version: "weekly",
    libraries: ["places"]

    
});
*/