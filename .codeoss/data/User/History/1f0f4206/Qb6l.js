import express from 'express';
import dbConnection from '../database/db.js';

const encodingUrl = express.urlencoded({ extended: true });
const router = express.Router();

router.post('/', encodingUrl, async (req, res) => {
    
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    const pool = await dbConnection();

    if (!pool) {
        console.error('Database connection pool not available.');
        req.flash('error', 'Database connection failed. Please try again later.');
        return res.redirect('/');
    }

    const { fullname, emailSign, sms } = req.body;

    const executeQuery = async (connection) => {
        console.log('Checking if user already exists:', fullname);

        const [result] = await connection.query('SELECT * FROM signup WHERE fullname = ?', [fullname]);
        console.log('Query result:', result);

        if (result.length > 0) {
            req.flash('error', 'You have already signed up.');
            return res.redirect('/');
        }

        const sql = 'INSERT INTO signup (fullname, emailSign, sms) VALUES (?, ?, ?)';
        await connection.query(sql, [fullname, emailSign, sms]);
        console.log('User signed up successfully:', fullname);

        req.flash('success', 'You are now signed up. :)');
        return res.redirect('/');
    };

    pool.getConnection()
        .then(connection => {
            executeQuery(connection)
                .catch(err => {
                    console.error('Error during signup:', err.stack);
                    req.flash('error', 'Database error. Please try again later.');
                    res.redirect('/');
                })
                .finally(() => connection.release());
        })
        .catch(err => {
            console.error('Error acquiring database connection:', err.stack);
            req.flash('error', 'Database error. Please try again later.');
            res.redirect('/');
        });
});

export default router;
