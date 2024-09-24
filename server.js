const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// Create MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Database connected');
});

// 1. Retrieve all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.json(results);
  });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.json(results);
  });
});

// 3. Filter patients by First Name
app.get('/patients/filter', (req, res) => {
  const { first_name } = req.query;
  const query = 'SELECT * FROM patients WHERE first_name = ?';
  connection.query(query, [first_name], (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.json(results);
  });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/specialty', (req, res) => {
  const { specialty } = req.query;
  const query = 'SELECT * FROM providers WHERE provider_specialty = ?';
  connection.query(query, [specialty], (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.json(results);
  });
});

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
