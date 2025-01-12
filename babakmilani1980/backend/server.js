// server.js
import 'dotenv/config';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'express-flash';
import favicon from 'serve-favicon';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import createConnection, { closeConnection } from './database/db.js';
import indexRouter from './routes/index.js';
import signupRouter from './routes/signup.js';
import signinRouter from './routes/signin.js';
import aboutRouter from './routes/about.js';
import dashboard from './routes/dashboard.js';
import registerRouter from './routes/register.js';
import report from './routes/report.js';
import logs from './routes/logs.js';
import profile from './routes/profile.js';
import logout from './routes/logout.js';
import uploadRouter from './routes/uploads.js';
import passwordChangeRouter from './routes/passwordChange.js';
import fileUpload from 'express-fileupload';
import googleMapsRouter from './maps API/googleMaps.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Establish database connection
(async () => {
    try {
        await createConnection();
        console.log('Database connection established successfully.');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1); // Exit if the database connection fails
    }
})();

process.on('SIGINT', async () => {
    console.log('SIGINT received. Shutting down gracefully...');
    try {
        await closeConnection();
    } catch (err) {
        console.error('Error while closing database connection:', err.message);
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    try {
        await closeConnection();
    } catch (err) {
        console.error('Error while closing database connection:', err.message);
    }
    process.exit(0);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(fileUpload());

// Session middleware
app.use(session({
    secret: "thisaintnosecret",
    saveUninitialized: false,
    cookie: { secure: false }, // 24 hours
    resave: false
}));

app.use(cookieParser());

// Setup flash middleware
app.use(flash());

app.use(favicon(path.join(__dirname, '../frontend/public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.set('views', path.join(__dirname, '../frontend/views'));
app.set('view engine', 'ejs');

// Use the routes for the paths
app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);
app.use('/register', registerRouter);
app.use('/dashboard', dashboard);
app.use('/report', report);
app.use('/logs', logs);
app.use('/profile', profile);
app.use('/report/uploads', uploadRouter);
app.use('/logs/uploads', uploadRouter);
app.use('/profile/uploads', uploadRouter);
app.use('/maps', googleMapsRouter);
app.use('/profile/passwordChange', passwordChangeRouter);
app.use('/logout', logout);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
