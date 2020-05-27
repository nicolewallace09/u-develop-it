// import sqlite3 // verbose - to produce messages in the terminal regarding the state of the runtime 
const sqlite3 = require('sqlite3').verbose();

// import express
const express = require('express'); 

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

// GET route
// app.get('/', (req, res) => {
//     res.json({
//         message: 'Hello World'
//     });
// }); 

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