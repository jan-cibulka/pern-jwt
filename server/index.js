const express = require('express');
const app = express();
const cors = require('cors');

// middleware

app.use(express.json());
app.use(cors());

// routes
app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});
