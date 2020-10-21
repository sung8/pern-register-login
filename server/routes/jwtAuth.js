const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

// registering
router.post("/register", async (req, res) => {
  try {
    // 1. destructure the req.body (name, email, password)
    const { name, email, password } = req.body;
    // 2. check if user exists (if user exists then throw error)
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);
    //res.json(user.rows);

    if (user.rows.length !== 0) {
      // 401 is unauthenticated
      // 403 is unauthorized
      return res.status(401).send("User already exists");
    }
    // 3. bcrypt the user password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. enter the new user inside database
    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );
    res.json(newUser.rows[0]);
    // 5. generating our jwt token
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
