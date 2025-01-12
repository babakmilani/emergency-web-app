const { google } = require('googleapis');
const credentials = require('/home/babakmilani1980/credentials.json'); // Update the path to your credentials file

async function sendMimeMessage(mimeMessage) {
    const gmail = google.gmail('v1');

    const auth = new google.auth.JWT(
        credentials.client_email, // From your JSON key file
        null,
        credentials.private_key, // From your JSON key file
        ['https://www.googleapis.com/auth/gmail.send']
    );

    await auth.authorize();

    const response = await gmail.users.messages.send({
        auth: auth,
        userId: 'me',
        resource: {
            raw: mimeMessage
        }
    });

    console.log(response);
}

module.exports = { sendMimeMessage };
