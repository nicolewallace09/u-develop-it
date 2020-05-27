// import express
const express = require('express'); 

// port destination 
const PORT = process.env.PORT || 3001; 

// app expression
const app = express(); 

// express middleware 
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 

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

// listen function
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
}); 