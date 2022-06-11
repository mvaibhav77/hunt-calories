const express = require('express');
require('dotenv').config();

const PORT = process.env.PORT || 7000

const app = express();

app.use(express.static('public'))


app.listen(PORT, ()=>{console.log(`Server running on port ${PORT}`)});