/*
logs.js route for data display and search 
*/

// required dependencies for code
import express from 'express';
import path from 'path';

import dbConnection from '../database/db.js';

const router = express.Router();

const encodingUrl = express.urlencoded({ extended: true });// Example of using db for a query (inside a route)

// authentication function for URL
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
    let connection;

    try {
        const pool = await dbConnection();
        connection = await pool.getConnection();

        const searchTerm = req.query.q;
        const user = req.session.user;
        const successMessage = req.flash('success');
        let results = [];
        let imagePath = null;

        // Fetch profile image
        const [imageRows] = await connection.query('SELECT image FROM user_images WHERE username = ?', [user.name]);
        if (imageRows.length > 0) {
            imagePath = imageRows[0].image.toString('base64'); // Convert image buffer to base64 string
        }

        // If a search term exists, execute the search query
        if (searchTerm) {
            console.log('Search Term:', searchTerm);
            const query = `
                SELECT * 
                FROM emergencies 
                WHERE emergency LIKE ? OR address LIKE ? OR zip LIKE ? 
                ORDER BY id ASC
            `;
            const searchValue = `%${searchTerm}%`;
            const [searchResults] = await connection.query(query, [searchValue, searchValue, searchValue]);
            results = searchResults;
            console.log('Search Results:', results);
        }

        res.render('logs', { results, successMessage, user, imagePath });
    } catch (err) {
        console.error('Error:', err);
        req.flash('error', 'Database error');
        res.redirect('/logs');
    } finally {
        if (connection) connection.release();
    }
});


export default router;
