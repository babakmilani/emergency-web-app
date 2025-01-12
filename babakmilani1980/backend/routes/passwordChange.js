/*
passwordChange.js route for changing user password
*/

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dbConnection from '../database/db.js';
import bcrypt from 'bcrypt';

const router = express.Router();
const encodingUrl = express.urlencoded({ extended: true });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
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

        // Check database for user
        const [result] = await connection.query('SELECT * FROM registered_users WHERE userName = ?', [req.session.user.name]);

        res.render('profile', { successMessage: req.flash('success'), errorMessage: req.flash('error'), user: req.session.user, results: result , imagePath });
    } catch (err) {
        console.error('Dashboard error:', err);
        req.flash('error', 'Database error. Please try again.');
        res.redirect('/profile');
    } finally {
        if (connection) connection.release();
    }
});

router.post('/', isAuthenticated, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const pool = await dbConnection();
    let connection;

    try {
        connection = await pool.getConnection();

        // Retrieve the hashed password from the database
        const [rows] = await connection.query('SELECT passWord FROM registered_users WHERE userName = ?', [req.session.user.name]);
        console.log('Retrieved rows:', rows);

        if (rows.length === 0) {
            req.flash('error', 'User not found.');
            return res.redirect('/profile');
        }

        // Compare the current password
        const isMatch = await bcrypt.compare(currentPassword, rows[0].passWord);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            req.flash('error', 'Current password is incorrect.');
            return res.redirect('/profile');
        }

        // Hash the new password and update it in the database
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log('Hashed new password:', hashedPassword);

        await connection.query('UPDATE registered_users SET passWord = ? WHERE userName = ?', [hashedPassword, req.session.user.name]);
        console.log('Password updated in database.');

        req.flash('success', 'Password updated successfully.');
        return res.redirect('/profile');
    } catch (err) {
        console.error('Error changing password:', err);
        req.flash('error', 'Error updating password.');
        return res.redirect('/profile');
    } finally {
        if (connection) connection.release();
    }
});


export default router;