const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route     GET api/auth
// @desc      Get logged in user
// @access    Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/auth
// @desc      Login user & return a token
// @access    Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ err: result.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      //user does not exist
      if (!user) return res.status(400).json({err: {msg: 'User doesn\'t exist' }});
      //user and password do not match
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({err: {msg: 'Email and password do not match' }});
      }
      //send JWT back to user
      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET || config.get('jwtSecret'),
        {
          expiresIn: process.env.JWT_LIFE || config.get('jwtLife')
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
