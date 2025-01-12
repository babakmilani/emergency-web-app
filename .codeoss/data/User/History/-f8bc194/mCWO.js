const express = require('express');
const router = express.Router();
const { sendMimeMessage } = require('../smtp/gmailAuth');

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/submit', async (req, res) => {
    const { firstname, lastname, email, message } = req.body;
    const mimeMessage = `
        From: "Your Name" <your-email@example.com>
        To: ${email}
        Subject: Form Submission
        MIME-Version: 1.0
        Content-Type: text/html; charset=UTF-8
        
        <!doctype html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Form Submission</title>
        </head>
        <body>
            <h3>Form Submission Details</h3>
            <p>First Name: ${firstname}</p>
            <p>Last Name: ${lastname}</p>
            <p>Email: ${email}</p>
            <p>Message: ${message}</p>
        </body>
        </html>
    `;

    try {
        console.log('Sending email:', mimeMessage);
        await sendMimeMessage(Buffer.from(mimeMessage).toString('base64').replace(/\+/g, '-').replace(/\//g, '_'));
        res.send('Form submitted and email sent');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
    }
});


module.exports = router;
