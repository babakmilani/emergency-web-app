/*-- backend/routes/signin.js --*/
import express from 'express';
import bcrypt from 'bcryptjs';
import dbConnect from '../database/db.js';
import session from 'express-session';

const router = express.Router();

const encodingUrl = express.urlencoded({ extended: true });

router.post('/', encodingUrl, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    const pool = await dbConnect();  // Get the connection pool

    if (!pool) {
        req.flash('error', 'Something went wrong. Please try again later.');
        return res.redirect('/');
    }

    let connection;
    try {
        connection = await pool.getConnection();

        const { username: userName, psw: passWord } = req.body;

        const [result] = await connection.query('SELECT * FROM registered_users WHERE userName = ?', [userName]);

        if (result.length > 0) {
            const user = result[0];
            const match = await bcrypt.compare(passWord, user.passWord);

            if (match) {
                console.log('User successfully logged in.');
                req.session.user = { name: userName };
                return res.redirect('/dashboard');
            }
        }

        req.flash('error', 'Invalid username or password');
        return res.redirect('/');
    } catch (err) {
        console.error('Error during sign-in:', err);
        req.flash('error', 'An error occurred. Please try again.');
        return res.redirect('/');
    } finally {
        if (connection) connection.release();
    }
});


export default router;
