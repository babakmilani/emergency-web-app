
/* backend/database/db.js*/
import mysql from 'mysql2/promise';
import 'dotenv/config';

let pool; // Singleton instance

export async function createConnection() {
    if (pool) {
        return pool; // Reuse the existing pool
    }

    try {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        console.log('Database connection pool created');

        // Test the pool connection
        const connection = await pool.getConnection();
        console.log('Connected to the database as ID', connection.threadId);
        connection.release();

        return pool;
    } catch (err) {
        console.error('Error creating database connection pool:', err.message);
        throw err; // Rethrow the error for proper handling
    }
}

export async function closeConnection() {
    if (pool) {
        try {
            console.log('Closing the database connection pool');
            await pool.end();
            console.log('Database connection pool closed');
        } catch (err) {
            console.error('Error while closing database connection:', err.message);
            throw err; // Rethrow the error for proper handling
        }
    } else {
        console.warn('Attempted to close a non-existent pool');
    }
}

export default createConnection;



/*


import mysql from 'mysql2/promise';
import 'dotenv/config';

export async function createConnection() {
    

    const connection = await mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    console.log('Connected to the database', connection.threadID);

    // Example query to test the connection
    connection.getConnection((err, connection) => {
        if (err) {
            console.error('Error connection to the database:', err.stack);
        } else {
            console.log('Connected to the database as ID', connection.threadID);
            connection.release();
        }
    })
    return connection;
};

export default createConnection;

*/