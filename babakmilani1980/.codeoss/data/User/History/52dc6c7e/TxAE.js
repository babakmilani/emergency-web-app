const nodemailer = require('nodemailer');

const emailTransport = nodemailer.createTransport({
    streamTransport: true,
    newline: "unix",
    buffer: true
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: 'gstevensco@gmail.com',
        to,
        subject,
        html: htmlContent
    };


    try {
        await emailTransport.sendMail(mailOptions);
        console.log("email sent successfully ");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = { sendEmail };