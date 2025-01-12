/*
report.js route for adding emergencies to database
*/

// required dependencies for code
import express from 'express';
import path from 'path';

import dbConnection from '../database/db.js';

const encodingUrl = express.urlencoded({ extended: true });

const router = express.Router();

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    console.log('Session:', req.session);
    if (req.session.user) {
        return next();
    } else {
        console.log('User not authenticated.');
        req.flash('error', 'You must be logged in to access this page.');
        return res.redirect('/');
    }
}

router.get('/', isAuthenticated, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    
    let connection;

    try {
        const pool = await dbConnection();
        connection = await pool.getConnection();

        // Use the correct connection to query the database
        const [rows] = await connection.query('SELECT image FROM user_images WHERE username = ?', [req.session.user.name]);

        const imagePath = rows.length > 0 ? rows[0].image.toString('base64') : null; // Convert image buffer to base64 string
        const successMessage = req.flash('success');
        const user = req.session.user; // Already validated by isAuthenticated  

        res.render('report', { successMessage, user, imagePath });
    } catch (err) {
        console.error('Error:', err);
        req.flash('error', 'Database error');
        res.redirect('/report');
    } finally {
        if (connection) connection.release();
    }
});

// POST response for user entries to report data
router.post('/', encodingUrl, async (req, res) => {
    const pool = await dbConnection();  // Get the connection pool

    if (!pool) {
        console.error('Database connection failed');
        req.flash('error', 'Database connection failed. Please try again later.');
        return res.redirect('/report');
    }

    let connection;
    try {
        connection = await pool.getConnection();

        const userData = [
            req.body.agency,
            req.body.emergency,
            req.body.threat,
            req.body.address,
            req.body.state,
            req.body.zip
        ];

        const sql = 'INSERT INTO emergencies (agency, emergency, threat, address, state, zip) VALUES (?, ?, ?, ?, ?, ?)';
        await connection.query(sql, userData);

        req.flash('success', 'Your report has been recorded!');
        return res.redirect('/report');
        console.log('Request Body:', req.body);

    } catch (err) {
        console.log('Error during report submission:', err);
        req.flash('error', 'Database error. Please try again!');
        return res.redirect('/report');
    } finally {
        if (connection) connection.release();  // Release the connection back to the pool
    }
});

export default router;
