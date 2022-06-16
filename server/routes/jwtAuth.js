const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
  //1. deconstruct the request object
  const { name, email, password } = req.body;
  //2. check if user exists
  const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [email]);

  if (user.rows.length !== 0) {
    return res.status(401).send('User already exists');
  }

  //3. bcrypth the user password

  const saltRound = 10;
  const salt = await bcrypt.genSalt(saltRound);
  const bcryptPassword = await bcrypt.hash(password, salt);

  //4. enter the new user inside our database
  const newUser = await pool.query(
    'INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *',
    [name, email, bcryptPassword],
  );

  res.json(newUser.rows[0]);

  //5. generating the jwt token
  try {
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
