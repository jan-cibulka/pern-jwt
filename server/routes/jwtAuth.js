const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../middleware/validInfo');
const authorization = require('../middleware/authorization');
router.post('/login', validInfo, async function (req, res) {
  try {
    //1.destructure
    const { email, password } = req.body;

    //2.check if user doesnt exist

    const user = await pool.query('SELECT * FROM users WHERE user_email =$1', [email]);

    if (user.rows.length === 0) {
      return res.status(401).json('Password or email is incorrect');
    }

    //3.check if incoming password is same as database password
    console.log(user.rows[0].user_password, password);
    const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

    if (!validPassword) {
      return res.status(401).json('Password or email is incorrect');
    }

    //4. give them the twt token
    const token = jwtGenerator(user.rows[0].user_id);

    res.json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json('Server error');
  }
});

router.post('/register', validInfo, async (req, res) => {
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

  //5. generating the jwt token
  const token = jwtGenerator(newUser.rows[0].user_id);
  res.json({ token });
  try {
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/is-verify', authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
