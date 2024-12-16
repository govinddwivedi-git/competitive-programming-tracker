require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Database connection check
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
  
  // Check tables
  db.query('SHOW TABLES', (err, results) => {
    if (err) {
      console.error('Error checking tables:', err);
      return;
    }
    console.log('Available tables:', results);
  });
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

// Update the save-handles endpoint to handle duplicate entries
app.post('/save-handles', (req, res) => {
  const { email, codechef, codeforces, leetcode } = req.body;

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ message: 'Transaction error' });
    }

    // Helper function for upsert operation
    const upsertHandle = (table, email, username) => {
      return new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO ${table} (email, username) VALUES (?, ?) 
           ON DUPLICATE KEY UPDATE username = ?`,
          [email, username, username],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    };

    // Process each platform handle
    Promise.all([
      codechef ? upsertHandle('codechef', email, codechef) : Promise.resolve(),
      codeforces ? upsertHandle('codeforces', email, codeforces) : Promise.resolve(),
      leetcode ? upsertHandle('leetcode', email, leetcode) : Promise.resolve()
    ])
    .then(() => {
      db.commit((err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ message: 'Error committing transaction' });
          });
        }
        res.status(201).json({ message: 'Handles saved successfully' });
      });
    })
    .catch((err) => {
      db.rollback(() => {
        res.status(500).json({ 
          message: 'Error saving handles', 
          error: err.message 
        });
      });
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

// Add new endpoin t to get codechef handle by email
app.get('/user-codechef-handle/:email', (req, res) => {
  const { email } = req.params;
  db.query(
    'SELECT username FROM codechef WHERE email = ?',
    [email],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      if (!result || result.length === 0) {
        return res.status(200).json({ handle: null, message: 'No handle found' });
      }
      res.json({ handle: result[0].username });
    }
  );
});

// Add new endpoint to get all codeforces users
app.get('/codeforces-users', (req, res) => {
  console.log('Received request for /codeforces-users');
  db.query(
    'SELECT username FROM codeforces ORDER BY username ASC',
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      console.log('Codeforces users found:', result);
      res.json({ users: result });
    }
  );
});

// Add new endpoint to get codeforces handle by email
app.get('/user-codeforces-handle/:email', (req, res) => {
  const { email } = req.params;
  db.query(
    'SELECT username FROM codeforces WHERE email = ?',
    [email],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      if (!result || result.length === 0) {
        return res.status(200).json({ handle: null, message: 'No handle found' });
      }
      res.json({ handle: result[0].username });
    }
  );
});

// Add new endpoint to get all leetcode users
app.get('/leetcode-users', (req, res) => {
  db.query(
    'SELECT username FROM leetcode ORDER BY username ASC',
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.json({ users: result });
    }
  );
});

// Add new endpoint to get leetcode handle by email
app.get('/user-leetcode-handle/:email', (req, res) => {
  const { email } = req.params;
  db.query(
    'SELECT username FROM leetcode WHERE email = ?',
    [email],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      if (!result || result.length === 0) {
        return res.status(200).json({ handle: null, message: 'No handle found' });
      }
      res.json({ handle: result[0].username });
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
