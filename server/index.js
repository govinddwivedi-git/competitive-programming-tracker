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

// New endpoint to save coding handles
app.post('/save-handles', (req, res) => {
  const { email, codechef, codeforces, leetcode } = req.body;

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ message: 'Transaction error' });
    }

    // Insert into codechef table
    if (codechef) {
      db.query('INSERT INTO codechef (email, username) VALUES (?, ?)',
        [email, codechef],
        (err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ message: 'Error saving CodeChef handle' });
            });
          }
        }
      );
    }

    // Insert into codeforces table
    if (codeforces) {
      db.query('INSERT INTO codeforces (email, username) VALUES (?, ?)',
        [email, codeforces],
        (err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ message: 'Error saving Codeforces handle' });
            });
          }
        }
      );
    }

    // Insert into leetcode table
    if (leetcode) {
      db.query('INSERT INTO leetcode (email, username) VALUES (?, ?)',
        [email, leetcode],
        (err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ message: 'Error saving LeetCode handle' });
            });
          }
        }
      );
    }

    // Commit the transaction
    db.commit((err) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ message: 'Error committing transaction' });
        });
      }
      res.status(201).json({ message: 'Handles saved successfully' });
    });
  });
});

// Add new endpoint to get all codechef users
app.get('/codechef-users', (req, res) => {
  db.query(
    'SELECT username FROM codechef ORDER BY username ASC',
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      res.json({ users: result });
    }
  );
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
