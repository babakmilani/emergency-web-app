/*-- backend/routes/register.js route --*/
import express from 'express';
import dbConnection from '../database/db.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

const encodedUrl = express.urlencoded({ extended: true });

router.get('/', (req, res) => {
    res.render('register', { messages: req.flash() });
});

router.post('/', encodedUrl, async (req, res) => {
    console.log('Form Data Received:', req.body);
    const pool = await dbConnection();  // Get the connection pool

    if (!pool) {
        console.error('Database connection failed');
        req.flash('error', 'Database connection failed. Please try again later.');
        return res.redirect('/register');
    }

    let connection;
    try {
        connection = await pool.getConnection();

        const { fname, lname, regUname, regEmail, regPsw, regConfirmPassword } = req.body;
        if (

            !regUname || regUname.length < 6 || !/^[a-zA-Z0-9]+$/.test(regUname) ||
            !regEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail) ||
            !regPsw || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(regPsw) ||
            regPsw !== regConfirmPassword
        ) {
            req.flash('error', 'Invalid form data. Please try again.');
            return res.redirect('/register');
        }
        // Check if user already registered
        const [result] = await connection.query('SELECT * FROM registered_users WHERE userName = ?', [regUname]);

        if (result.length > 0) {
            req.flash('error', 'User already exists. Please try again.');
            return res.redirect('/register');
        }

        // Hash the password
        const hashedPsw = await bcrypt.hash(regPsw, 10);

        // If user not registered, insert new user
        const sql = 'INSERT INTO registered_users (firstName, lastName, userName, email, passWord) VALUES (?, ?, ?, ?, ?)';
        await connection.query(sql, [fname, lname, regUname, regEmail, hashedPsw]);

        req.flash('success', 'Registration Successful.');
        return res.redirect('/');

        req.session.regData = null;

    } catch (err) {
        console.error('Error during registration:', err);
        req.flash('error', 'Database error. Please try again later.');
        return res.redirect('/register');
    } finally {
        if (connection) connection.release();
        console.log('Request Body:', req.body);
        console.log('Flash Messages:', req.flash());
        // Release the connection back to the pool
    }
});

export default router;
