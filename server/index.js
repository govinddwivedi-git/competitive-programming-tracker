const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  port: 3307,  // Added port specification
  user: 'root',  // replace with your MySQL username
  password: 'openroot',  // replace with your MySQL password
  database: 'dbms_project'
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.query(
      'INSERT INTO master_login (email, first_name, last_name, password) VALUES (?, ?, ?, ?)',
      [email, firstName, lastName, hashedPassword],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already exists' });
          }
          return res.status(500).json({ message: 'Database error' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM master_login WHERE email = ?',
    [email],
    async (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      
      if (result.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      try {
        const match = await bcrypt.compare(password, result[0].password);
        if (match) {
          const user = { ...result[0] };
          delete user.password; // Don't send password back
          res.json({ message: 'Login successful', user });
        } else {
          res.status(401).json({ message: 'Invalid credentials' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error during authentication' });
      }
    }
  );
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
