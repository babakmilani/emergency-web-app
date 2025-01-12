// dashboard.js route is the user portal after log in
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dbConnection from '../database/db.js';
import { Buffer } from 'buffer';

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

// Protect the dashboard route with the isAuthenticated middleware
router.get('/', isAuthenticated, async (req, res) => {
    let connection;
    try {
        const pool = await dbConnection();
        connection = await pool.getConnection();

        const [rows] = await connection.query('SELECT image FROM user_images WHERE username = ?', [req.session.user.name]);
        const imagePath = rows.length > 0 ? rows[0].image.toString('base64') : null;

        res.render('dashboard', { successMessage: req.flash('success'), errorMessage: req.flash('error'), user: req.session.user, imagePath });
    } catch (err) {
        console.error('Dashboard error:', err);
        req.flash('error', 'Database error. Please try again.');
        res.redirect('/dashboard');
    } finally {
        if (connection) connection.release();
    }
});

router.post('/', encodingUrl, async (req, res) => {
    const connect = await dbConnection();

    if (!connect) {
        req.flash('error', 'Database connection failed. Try again!');
        return res.redirect('/dashboard');
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        req.flash('error', 'No files were uploaded.');
        return res.redirect('/dashboard');
    }

    let image = req.files.image;
    let imageBuffer = image.data; // Get the image data as a buffer

    // Save the image to the database
    const [result] = await connect.query('INSERT INTO user_images (username, image) VALUES (?, ?) ON DUPLICATE KEY UPDATE image = VALUES(image)', [req.session.user.name, imageBuffer]);
    req.flash('success', 'Image uploaded successfully!');
    return res.redirect('/dashboard');
});

export default router;
