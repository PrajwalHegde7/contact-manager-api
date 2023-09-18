const express = require('express');
const { check, validationResult } = require('express-validator');

const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const contactMatchUser = require('../middleware/contactMatchUser');

const router = express.Router();
//all contacts routes require authentication
router.use(auth);

// @route     GET api/contacts
// @desc      Read all users contacts
// @access    Private
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({err: {msg: 'server error'}});
  }
});

// @route     POST api/contacts
// @desc      Create new contact
// @access    Private
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Email is required')
      .not()
      .isEmpty(),
    check('phone', 'Phone is required')
      .not()
      .isEmpty(),

  ],
  async (req, res) => {
    //check errors from validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ err: result.array() });
    }

    //save to database and send response to client
    const { name, email, phone, type } = req.body;
    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id
      });
      const contact = await newContact.save();
      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({err: {msg: 'server error'}});
    }
  }
);

// @route     PUT api/contacts/:id
// @desc      Update contact
// @access    Private
router.put('/:id', contactMatchUser, async (req, res) => {
  try {
    //parse the request and build new contact
    const { name, email, phone, type } = req.body;
    const contactFields = {};
    if (name) contactFields.name = name;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;
    if (type) contactFields.type = type;

    //update in database and send response to client
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({err: {msg: 'server error'}});
  }
});

// @route     DELETE api/contacts/:id
// @desc      Delete contact
// @access    Private
router.delete('/:id', contactMatchUser, async (req, res) => {
  try {
    await Contact.findByIdAndRemove(req.params.id);
    res.json({err: { msg: 'Contact removed' }});
  } catch (err) {
    console.error(err.message);
    res.status(500).json({err: {msg: 'server error'}});
  }
});

module.exports = router;