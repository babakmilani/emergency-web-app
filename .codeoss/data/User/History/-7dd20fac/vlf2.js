/*-- backend/routes/log.js --*/
import express from 'express';

const router = express.Router();

// Logout route
router.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    // Log the current session state before logging out
    console.log('Session before logout:', req.session);

    req.flash('success', 'You have been logged out successfully');

    req.session.destroy(err => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).send('Logout failed!');
        }

        // Log the session after it's destroyed
        console.log('Session after logout:', req.session);  // This should be empty or undefined

        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect('/'); // Redirect to the login page or homepage
    });
});

export default router;
