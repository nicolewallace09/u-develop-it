// importing express
const express = require('express');

// importing db 
const db = require('./db/database'); 

// port destination 
const PORT = process.env.PORT || 3001; 

// app expression
const app = express(); 

// importing apiRoutes folder 
const apiRoutes = require('./routes/apiRoutes');

// express middleware 
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 

// use apiRoutes
app.use('/api', apiRoutes);


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

