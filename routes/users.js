const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const router = express.Router();

// @route     POST api/users
// @desc      Regiter a user
// @access    Public
router.post(
  '/',
  [
    check('name', 'Please add a username')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
      ).isLength({ min: 6 })
  ],
  async (req, res) => {
    //check errors of request input
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ err: result.array() });
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ err: {msg: 'User already exists' }});
      
      //encrypt the user's password before save to database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = new User({
        name,
        email,
        password: hashedPassword
      });
      await user.save();

      //send JWT back to user
      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: config.get('jwtLife')
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({err: {msg: 'server error' }});
    }
  }
);

module.exports = router;