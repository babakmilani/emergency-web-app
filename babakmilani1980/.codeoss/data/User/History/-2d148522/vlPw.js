/*-- backend/routes/uploads.js --*/
import express from 'express';
import fileUpload from 'express-fileupload';
import dbConnection from '../database/db.js';

const router = express.Router();

const encodingUrl = express.urlencoded({ extended: true });

// Middleware for file uploads
router.use(fileUpload({
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit files to 2MB
    abortOnLimit: true, // Immediately reject files exceeding the limit
    responseOnLimit: 'File size limit has been reached!',
}));

router.post('/uploads', encodingUrl, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    
    const pool = await dbConnection();

    if (!pool) {
        req.flash('error', 'Database connection failed. Please try again later.');
        return res.redirect('/dashboard');
    }

    let connection;
    try {
        connection = await pool.getConnection();

        // Check if a file was uploaded
        if (!req.files || !req.files.image) {
            req.flash('error', 'No files were uploaded.');
            return res.redirect('/dashboard');
        }

        const { image } = req.files; // Destructure uploaded file

        // Validate file type
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimeTypes.includes(image.mimetype)) {
            req.flash('error', 'Only images (JPEG, PNG, GIF) are allowed.');
            return res.redirect('/dashboard');
        }

        const imageBuffer = image.data; // Access the file buffer
        const username = req.session.user.name; // Get the username from the session

        // Save the image to the database
        await connection.query(
            'INSERT INTO user_images (username, image) VALUES (?, ?) ON DUPLICATE KEY UPDATE image = VALUES(image)',
            [username, imageBuffer]
        );

        req.flash('success', 'Image uploaded successfully!');
        return res.redirect('/dashboard');
    } catch (err) {
        console.error('Error uploading image:', err);
        req.flash('error', 'Error uploading image. Please try again.');
        return res.redirect('/dashboard');
    } finally {
        // Ensure the connection is released back to the pool
        if (connection) connection.release();
    }
});

export default router;
