require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// test rapid
app.get('/', (req, res) => res.send('welcome to ucab.ro backend server. The future of ride-sharing and delivery food in Romania!'));

app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
