const express = require('express');
const { open } = require('sqlite');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const dbPath = path.join(__dirname, 'ccdata.db');

app.use(cors({
    origin: 'http://localhost:3000', // Adjust to match your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

let db = null;

const initiateAndStartDatabaseServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        app.listen(3000, () => {
            console.log('Backend Server is running at http://localhost:3000/');
        });
    } catch (e) {
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
    }
};

initiateAndStartDatabaseServer();

app.get('/mentors', async (req, res) => {
    try {
        const mentorsQuery = 'SELECT * FROM mentors;';
        const response = await db.all(mentorsQuery);
        res.send(response);
    } catch (error) {
        console.error('Error fetching mentors:', error.message);
        res.status(500).json({ error: 'Failed to fetch mentors' });
    }
});

app.get('/bookings', async (req, res) => {
    try {
        const bookingsQuery = 'SELECT * FROM Bookings;';
        const response = await db.all(bookingsQuery);
        res.send(response);
    } catch (error) {
        console.error('Error fetching bookings:', error.message);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

app.post('/bookings', async (req, res) => {
    const { studentname, mentorid, time, date, notes, selectedDuration } = req.body;

    // Log incoming request data for debugging
    console.log('Incoming booking request:', req.body);

    const insertQuery = `
        INSERT INTO Bookings (student_name, mentor_id, booking_date, booking_time, notes, duration)
        VALUES (?, ?, ?, ?, ?, ?)`;

    try {
        await db.run(insertQuery, [studentname, mentorid, date, time, notes, selectedDuration]);
        res.status(201).json({ message: 'Booking created successfully' });
    } catch (error) {
        console.error('Error inserting booking:', error.message);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// Add DELETE endpoint if needed
app.delete('/bookings', async (req, res) => {
    const { studentName } = req.body;

    if (!studentName) {
        return res.status(400).json({ error: 'Student name is required' });
    }

    const deleteQuery = 'DELETE FROM Bookings WHERE student_name = ?';

    try {
        await db.run(deleteQuery, [studentName]);
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error.message);
        res.status(500).json({ error: 'Failed to delete booking' });
    }
});





