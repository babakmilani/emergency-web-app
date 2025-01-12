/*
profile.js route for user to update user information
*/

// required dependencies for code
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Buffer } from 'buffer';
import dbConnection from '../database/db.js';

const router = express.Router();

const encodingUrl = express.urlencoded({ extended: true });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    let connection;

    try {
        const pool = await dbConnection();
        connection = await pool.getConnection();

        const [rows] = await connection.query('SELECT image FROM user_images WHERE username = ?', [req.session.user.name]);

        // Check database for user
        const [result] = await connection.query('SELECT * FROM registered_users WHERE userName = ?', [req.session.user.name]);

        const imagePath = rows.length > 0 ? rows[0].image.toString('base64') : null; // Convert image buffer to base64 string
        const successMessage = req.flash('success');
        const user = req.session.user; // Already validated by isAuthenticated  

        res.render('profile', { successMessage, user, imagePath, results: result });
    } catch (err) {
        console.error('Error:', err);
        req.flash('error', 'Database error');
        res.redirect('/profile');
    } finally {
        if (connection) connection.release();
    }
});

// POST response for adding data to the user database
router.post('/', encodingUrl, async (req, res) => {
    const connect = await dbConnection();

    if (!connect) {
        req.flash('error', 'Database connection failed. Try again!');
        return res.redirect('/profile');
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        req.flash('error', 'No files were uploaded.');
        return res.redirect('/profile');
    }

    let image = req.files.image;
    let imageBuffer = image.data; // Get the image data as a buffer

    try {
        // Save the image to the database
        const [result] = await connect.query('INSERT INTO user_images (username, image) VALUES (?, ?) ON DUPLICATE KEY UPDATE image = VALUES(image)', [req.session.user.name, imageBuffer]);
        req.flash('success', 'Image uploaded successfully!');
    } catch (err) {
        console.error('Error uploading image:', err);
        req.flash('error', 'Database error. Please try again.');
    } finally {
        return res.redirect('/profile');
    }
});

export default router;
