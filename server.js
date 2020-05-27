// import sqlite3 // verbose - to produce messages in the terminal regarding the state of the runtime 
const sqlite3 = require('sqlite3').verbose();

// import express
const express = require('express'); 

// importing inputCheck
const inputCheck = require('./utils/inputCheck');

// port destination 
const PORT = process.env.PORT || 3001; 

// app expression
const app = express(); 

// express middleware 
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 

// connect to database
const db = new sqlite3.Database('./db/election.db', err => {
    if (err) {
      return console.error(err.message);
    }
  
    console.log('Connected to the election database.');
  });

// GET a single candidate 
app.get('/api/candidate/:id', (req, res) => {
  const sql = `SELECT * FROM candidates
               WHERE id = ?`; 
  const params = [req.params.id]; 
  db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message }); 
        return; 
      }
      res.json({
        message: 'success',
        data: row
      });
  });
}); 

// delete a candidate 
app.delete('/api/candidate/:id', (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`; 
  const params = [req.params.id]; 
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: res.message });
      return; 
    }
    res.json({
      message: 'successfully deleted',
      changes: this.changes
    });
  });
}); 

// create a candidate - verify info 
app.post('/api/candidate', ({ body }, res) => {
  const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
  if (errors) {
    res.status(400).json({ error: errors }); 
    return; 
  }
  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
              VALUES (?,?,?)`; 
  const params = [body.first_name, body.last_name, body.industry_connected];

  // ES5 function. not arrow function, to use this
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: err.message }); 
      return;
    }
    res.json({
      message: 'success',
      data: body, 
      id: this.lastID
    }); 
  }); 
}); 

// all runs the SQL query and executes the callback with all the resulting rows 
// receive all candidates 
app.get('/api/candidates', (req, res) => {
  const sql = `SELECT * FROM candidates`; 
  const params = []; 
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json ({
      message: 'success',
      data: rows
    });
  }); 
});

// default response for any other request (Not Found) Catch all
app.use((req, res) => {
    res.status(404).end();
}); 

// start server after DB connection 
db.on('open', () => {
    // listen function
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`); 
    }); 
}); 

